import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CallIDPayload } from 'src/webrtc/types';
import { WsException } from '@nestjs/websockets';
import { WithUser } from 'src/auth/types';
import { CallsService } from 'src/calls/calls.service';
import {
  AppendRecordPayload,
  FilteredRecords,
  RecordErrors,
  RecordFilters,
  RecordFluentTrancriptionSeq,
  RecordIncluders,
  RecordType,
} from './types';
import { Record as RecordModel } from './records.model';
import { Call as CallModel } from 'src/calls/calls.model';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import {
  CHUNK_DURATION,
  PROCESS_TOTAL_OFFSET,
  RECORDS_FILE_PATH,
  TARGET_EXT,
} from './constants';
import { extension } from 'mime-types';
import promisify = require('promisify-node');
import {
  buildAppenderSideName,
  buildTranscriptionForeignId,
  getCallSideChunkNames,
  getDuration,
} from './helpers';
import { last, takeWhile } from 'lodash';
import { CallSide, CallStatus, CallType } from 'src/calls/types';
import { SRService } from 'src/SpeechRecognition/sr.service';
import { nanoid } from 'nanoid';
import { SRMode, TranscriptionUnit } from 'src/SpeechRecognition/types';
import { Transcription as TranscriptionModel } from './transcription.model';
import { consoleBlue } from 'helpers/coloredConsole';
import { Readable } from 'stream';
import { existsSync } from 'fs';
import { Where } from 'sequelize/types/utils';
import { Op } from 'sequelize';
import { User as UserModel } from 'src/users/users.model';

const promisedFs = promisify('fs');

const includers = (mode: RecordIncluders) => {
  const res = [
    {
      model: CallModel,
      as: 'call',
      include: [
        {
          model: UserModel,
          as: 'caller',
        },
        {
          model: UserModel,
          as: 'callee',
        },
      ],
    },
  ] as any;

  if (mode === RecordIncluders.base) return res;

  if (mode === RecordIncluders.deep) {
    res.push(
      {
        model: TranscriptionModel,
        as: 'transcriptionCaller',
      },
      {
        model: TranscriptionModel,
        as: 'transcriptionCallee',
      },
    );
  }

  if (mode === RecordIncluders.fluent) {
    res.push(
      {
        model: TranscriptionModel,
        as: 'transcriptionCallerFluent',
      },
      {
        model: TranscriptionModel,
        as: 'transcriptionCalleeFluent',
      },
    );
  }

  return res;
};

@Injectable()
export class RecordsService {
  recordFluentTrancriptionSeq: RecordFluentTrancriptionSeq = {};
  constructor(
    @InjectModel(RecordModel)
    private recordModel: typeof RecordModel,
    @InjectModel(TranscriptionModel)
    private transcriptionModel: typeof TranscriptionModel,
    private callsService: CallsService,
    private srService: SRService,
    private sequelize: Sequelize,
  ) {}

  async findRecordById(id: number): Promise<RecordType | null> {
    return await this.recordModel.findByPk(id, {
      include: includers(RecordIncluders.all),
    });
  }

  async findByFilters(
    payload: RecordFilters,
    includeMode: RecordIncluders,
  ): Promise<FilteredRecords> {
    const where = {
      '$call.callerId$': payload.callersList
        ? { [Op.in]: payload.callersList }
        : undefined,
      '$call.calleeId$': payload.calleesList
        ? { [Op.in]: payload.calleesList }
        : undefined,
      '$call.status$': { [Op.in]: payload.status },
      duration: {
        [Op.between]: [payload.duration.from, payload.duration.to],
      },
    };

    const total = await this.recordModel.count({
      where,
      include: includers(includeMode),
    });

    const records = await this.recordModel.findAll({
      where,
      limit: payload.limit ? Number(payload.limit) : undefined,
      offset: payload.page
        ? (Number(payload.page) - 1) * Number(payload.limit)
        : undefined,
      include: includers(includeMode),
    });

    return { total, records };
  }

  async createRecord(
    payload: WithUser<CallIDPayload>,
  ): Promise<RecordType | null> {
    const call = await this.callsService.findCallById(payload.callId);

    if (!call) {
      throw new WsException(RecordErrors.WrongCallToAttach);
    }

    if (call.recordId) {
      throw new WsException(RecordErrors.RecordExist);
    }

    let record = null;
    await this.sequelize.transaction(async (t) => {
      record = await this.recordModel.create(
        {
          callId: call.id,
        },
        { transaction: t },
      );

      if (record) {
        await this.callsService.addRecord(record.id, call.id);

        const srcDirPath = path.resolve(RECORDS_FILE_PATH, String(record.id));

        await promisedFs.mkdir(srcDirPath);
      }
    });

    return await this.findRecordById(record.id);
  }

  async getExistingRecord(
    callId: number,
    userId: number,
  ): Promise<{
    call: CallType;
    record: RecordType;
    recordPath: string;
    side: CallSide;
  }> {
    const call = await this.callsService.findCallById(callId);

    if (!call) {
      throw new WsException(RecordErrors.WrongCallToAttach);
    }

    const side = userId === call.callerId ? CallSide.Caller : CallSide.Callee;

    const record = await this.findRecordById(call.recordId);

    const recordPath = record?.id
      ? path.resolve(RECORDS_FILE_PATH, String(record.id))
      : '';

    return {
      recordPath,
      call,
      record,
      side,
    };
  }

  async appendRecord(payload: WithUser<AppendRecordPayload>): Promise<void> {
    const { recordPath, record, side } = await this.getExistingRecord(
      payload.callId,
      payload.user.id,
    );

    const format = extension(payload.format);

    if (!format || !recordPath) return;

    const sideChunks = await getCallSideChunkNames(recordPath, side);

    const lastChunkNumber: number = sideChunks.length
      ? parseInt(last(sideChunks))
      : 0;

    const tmpPath = path.resolve(
      recordPath,
      `${lastChunkNumber + 1}_${buildAppenderSideName(side)}_tmp.mp3`,
    );

    ffmpeg(Readable.from(Buffer.from(new Uint8Array(payload.recordBlob)))).save(
      tmpPath,
    );

    this.transcriptRecord(record.id, SRMode.fluent, side, tmpPath);
  }

  async stopRecord(payload: WithUser<CallIDPayload>): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(resolve, CHUNK_DURATION + PROCESS_TOTAL_OFFSET),
    );

    const { side, record, recordPath } = await this.getExistingRecord(
      payload.callId,
      payload.user.id,
    );

    const targetPath = path.resolve(
      recordPath,
      `${buildAppenderSideName(side)}.${TARGET_EXT}`,
    );

    const sideChunks = await getCallSideChunkNames(recordPath, side);

    if (!sideChunks.length) {
      return;
    }

    await promisedFs.writeFile(targetPath, '');

    let fn = ffmpeg();

    sideChunks.forEach((chunk) => {
      fn = fn.input(path.resolve(recordPath, chunk));
    });

    await new Promise<void>((resolve, reject) => {
      fn.format(TARGET_EXT)
        .mergeToFile(targetPath)
        .on('end', () => {
          resolve();
        })
        .on('error', (e) => {
          console.log('mergeReject', e);
          reject();
        });
    });

    const callerPath = path.resolve(
      recordPath,
      `${buildAppenderSideName(CallSide.Callee)}.${TARGET_EXT}`,
    );

    const calleePath = path.resolve(
      recordPath,
      `${buildAppenderSideName(CallSide.Caller)}.${TARGET_EXT}`,
    );

    const mergedPath = path.resolve(recordPath, `srcMerged.${TARGET_EXT}`);
    await this.sequelize.transaction(async (t) => {
      await this.recordModel.update(
        {
          [buildAppenderSideName(side)]: targetPath,
        },
        { transaction: t, where: { id: record.id } },
      );

      if (
        existsSync(callerPath) &&
        existsSync(calleePath) &&
        !existsSync(mergedPath)
      ) {
        await new Promise((resolve) =>
          ffmpeg()
            .input(callerPath)
            .input(calleePath)
            .complexFilter([
              {
                filter: 'amix',
                options: { inputs: 2, duration: 'longest' },
              },
            ])
            .on('end', resolve)
            .saveToFile(mergedPath),
        );

        const duration = await getDuration(mergedPath);

        await this.recordModel.update(
          {
            srcMerged: mergedPath,
            duration,
          },
          { transaction: t, where: { id: record.id } },
        );
      }
    });

    if (this.recordFluentTrancriptionSeq[record.id]) {
      delete this.recordFluentTrancriptionSeq[record.id];
    }

    this.transcriptRecord(record.id, SRMode.deep, side, targetPath);
  }

  async transcriptRecord(
    recordId: number,
    mode: SRMode,
    side: CallSide,
    src: string,
  ) {
    const taskId = nanoid();

    if (mode === SRMode.fluent) {
      if (!this.recordFluentTrancriptionSeq[recordId]) {
        this.recordFluentTrancriptionSeq[recordId] = {};
      }

      if (!this.recordFluentTrancriptionSeq[recordId][side]) {
        this.recordFluentTrancriptionSeq[recordId][side] = [];
      }

      this.recordFluentTrancriptionSeq[recordId][side].push({ taskId, src });
    }

    const result = await this.srService.speechToText(src, mode, taskId);
    const record = await this.findRecordById(recordId);

    let unitsToWrite: TranscriptionUnit[] = [];

    if (mode === SRMode.fluent) {
      this.recordFluentTrancriptionSeq[recordId][side] =
        this.recordFluentTrancriptionSeq[recordId][side].map((task) =>
          task.taskId === taskId ? { ...task, result: result.result } : task,
        );

      const tasksToWrite = takeWhile(
        this.recordFluentTrancriptionSeq[recordId][side],
        (value) => !!value.result,
      );

      const transcripts =
        side === CallSide.Callee
          ? record.transcriptionCalleeFluent
          : record.transcriptionCallerFluent;
      const lastTimestamp = transcripts?.length ? last(transcripts).end : 0;

      for (let i = 0; i < tasksToWrite.length; i++) {
        const curTask = tasksToWrite[i];

        const duration = await getDuration(curTask.src);

        curTask.result.forEach((unit, inx, arr) => {
          unitsToWrite.push({
            ...unit,
            start: Number(lastTimestamp) + Number(unit.start),
            end:
              Number(lastTimestamp) +
              Number(inx === arr.length - 1 ? duration : unit.end),
          });
        });
      }
    } else {
      unitsToWrite = result.result;
    }

    await this.sequelize.transaction(async (t) => {
      await this.transcriptionModel.bulkCreate(
        unitsToWrite.map((unit) => ({
          ...unit,
          [buildTranscriptionForeignId(side, mode)]: record.id,
        })),
        { transaction: t },
      );
    });
  }
}
