import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CallIDPayload } from 'src/webrtc/types';
import { WsException } from '@nestjs/websockets';
import { WithUser } from 'src/auth/types';
import { CallsService } from 'src/calls/calls.service';
import {
  AppenderSide,
  AppendRecordPayload,
  RecordErrors,
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
import { getCallSideChunkNames } from './helpers';
import { last } from 'lodash';
import { CallType } from 'src/calls/types';
import { SRService } from 'src/SpeechRecognition/sr.service';
import { SRMode } from 'src/SpeechRecognition/types';

const promisedFs = promisify('fs');

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(RecordModel)
    private recordModel: typeof RecordModel,
    private callsService: CallsService,
    private srService: SRService,
    private sequelize: Sequelize,
  ) {}

  async findRecordById(id: number): Promise<RecordType | null> {
    return await this.recordModel.findByPk(id, {
      include: [
        {
          model: CallModel,
          as: 'call',
        },
      ],
    });
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
    appenderSide: AppenderSide;
    call: CallType;
    record: RecordType;
    recordPath: string;
  }> {
    const call = await this.callsService.findCallById(callId);

    if (!call) {
      throw new WsException(RecordErrors.WrongCallToAttach);
    }

    const appenderSide =
      userId === call.callerId
        ? AppenderSide.srcCaller
        : AppenderSide.srcCallee;

    const record = await this.findRecordById(call.recordId);

    const recordPath = record?.id
      ? path.resolve(RECORDS_FILE_PATH, String(record.id))
      : '';

    return {
      recordPath,
      call,
      appenderSide,
      record,
    };
  }

  async appendRecord(payload: WithUser<AppendRecordPayload>): Promise<void> {
    const { appenderSide, recordPath } = await this.getExistingRecord(
      payload.callId,
      payload.user.id,
    );

    const format = extension(payload.format);

    if (!format || !recordPath) return;

    const sideChunks = await getCallSideChunkNames(recordPath, appenderSide);

    const lastChunkNumber: number = sideChunks.length
      ? parseInt(last(sideChunks))
      : 0;

    const tmpPath = path.resolve(
      recordPath,
      `${lastChunkNumber + 1}_${appenderSide}_tmp.${format}`,
    );

    await promisedFs.writeFile(
      tmpPath,
      Buffer.from(new Uint8Array(payload.recordBlob)),
    );

    await this.srService.speechToText(tmpPath, SRMode.fluent);
  }

  async stopRecord(payload: WithUser<CallIDPayload>): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(resolve, CHUNK_DURATION + PROCESS_TOTAL_OFFSET),
    );

    const { appenderSide, record, recordPath } = await this.getExistingRecord(
      payload.callId,
      payload.user.id,
    );

    const targetPath = path.resolve(
      recordPath,
      `${appenderSide}.${TARGET_EXT}`,
    );

    const sideChunks = await getCallSideChunkNames(recordPath, appenderSide);

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
        .on('error', () => {
          reject();
        });
    });

    await this.sequelize.transaction(async (t) => {
      await this.recordModel.update(
        {
          [appenderSide]: targetPath,
        },
        { transaction: t, where: { id: record.id } },
      );
    });
  }

  async processSpeechToText() {}
}
