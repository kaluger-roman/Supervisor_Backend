import { CallSide, CallType } from 'src/calls/types';
import { TranscriptionUnit } from 'src/SpeechRecognition/types';
import { CallIDPayload } from 'src/webrtc/types';

export type RecordType = {
  id: number;
  srcCaller: string;
  srcCallee: string;
  callId: number;
  call: CallType;
  transcriptionCaller: TranscriptionUnit[];
  transcriptionCallee: TranscriptionUnit[];
  transcriptionCallerFluent: TranscriptionUnit[];
  transcriptionCalleeFluent: TranscriptionUnit[];
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
