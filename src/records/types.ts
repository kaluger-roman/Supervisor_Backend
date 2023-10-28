import { CallSide, CallStatus, CallType } from 'src/calls/types';
import { TranscriptionUnit } from 'src/SpeechRecognition/types';
import { SortOrder } from 'src/types';
import { CallIDPayload } from 'src/webrtc/types';

export type RecordType = {
  id: number;
  srcCaller: string;
  srcCallee: string;
  srcMerged: string;
  callId: number;
  call: CallType;
  duration: number;
  transcriptionCaller: TranscriptionUnit[];
  transcriptionCallee: TranscriptionUnit[];
  transcriptionCallerFluent: TranscriptionUnit[];
  transcriptionCalleeFluent: TranscriptionUnit[];
};

export enum SortedFieldsRecordFilters {
  calleeName = 'calleeName',
  callerName = 'callerName',
  id = 'id',
  start = 'start',
  duration = 'duration',
  status = 'status',
}

export type SortItem = { key: SortedFieldsRecordFilters; order: SortOrder };

export type RecordFilters = {
  calleesList: string[];
  callersList: string[];
  duration: DurationFilter;
  limit?: number;
  page?: number;
  status?: CallStatus[];
  orderBy?: SortItem[];
  crimeRateFilter: number;
};

export type SrcPayload = {
  id: number;
};

export type TranscriptionPayload = {
  id: number;
};

export type DurationFilter = {
  from: number;
  to: number;
};

export enum RecordErrors {
  WrongCallToAttach = 'WrongCallToAttach',
  RecordExist = 'RecordExist',
}

export type AppendRecordPayload = CallIDPayload & {
  recordBlob: Buffer;
  format: string;
};

export enum AppenderSide {
  srcCaller = 'srcCaller',
  srcCallee = 'srcCallee',
}

export type RecordFluentTrancriptionSeq = {
  [recordId: number]: {
    [key in CallSide]?: {
      taskId: string;
      src: string;
      result?: TranscriptionUnit[];
    }[];
  };
};

export enum RecordIncluders {
  all = 'all',
  base = 'base',
  fluent = 'fluent',
  deep = 'deep',
}

export type FilteredRecords = { records: Partial<RecordType>[]; total: number };
