import { Body, Controller, Post } from '@nestjs/common';
import { pick } from 'lodash';
import { CallStatus } from 'src/calls/types';
import { ROUTES } from 'src/routes.constants';
import * as fs from 'fs';
import { RecordsService } from './records.service';
import {
  FilteredRecords,
  RecordFiltersPayload,
  RecordIncluders,
  SrcPayload,
  TranscriptionPayload,
} from './types';
import { TranscriptionUnit } from 'src/SpeechRecognition/types';

@Controller(ROUTES.API.RECORDS.BASE)
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @Post(ROUTES.API.RECORDS.FULL)
  async getRecords(
    @Body() body: RecordFiltersPayload,
  ): Promise<FilteredRecords> {
    const { records, total } = await this.recordsService.findByFilters(
      { ...body, status: [CallStatus.ended] },
      RecordIncluders.base,
    );

    return {
      total,
      records: records.map((record) =>
        pick(record, [
          'id',
          'duration',
          'call.id',
          'call.status',
          'call.statusSequence',
          'call.statusTimestampsSequence',
          'call.calleeWebrtcNumber',
          'call.callerWebrtcNumber',
          'call.callee.username',
          'call.caller.username',
          'call.callerId',
          'call.calleeId',
        ]),
      ),
    };
  }

  @Post(ROUTES.API.RECORDS.SRC)
  async getRecordSrc(@Body() body: SrcPayload): Promise<Buffer | null> {
    const record = await this.recordsService.findRecordById(body.id);

    if (!record.srcMerged) return null;

    return await new Promise((resolve) =>
      fs.readFile(record.srcMerged, (_, bin) => resolve(bin)),
    );
  }

  @Post(ROUTES.API.RECORDS.TRANSCRIPTION)
  async getTranscriptionSrc(
    @Body() body: TranscriptionPayload,
  ): Promise<{ caller: TranscriptionUnit[]; callee: TranscriptionUnit[] }> {
    const record = await this.recordsService.findRecordById(body.id);

    if (!record.transcriptionCallee || !record.transcriptionCaller)
      return { caller: null, callee: null };

    return {
      caller: record.transcriptionCaller,
      callee: record.transcriptionCallee,
    };
  }
}
