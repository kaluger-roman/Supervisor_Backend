import { CallType } from 'src/calls/types';
import { CallIDPayload } from 'src/webrtc/types';

export type RecordType = {
  id: number;
  srcCaller: string;
  srcCallee: string;
  callId: number;
  call: CallType;
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
