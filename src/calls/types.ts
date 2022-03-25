import { User } from 'src/users/types';

export type CallRecord = {
  id: number;
  statusSequence: CallStatus[];
  statusTimestampsSequence: number[];
  calleeWebrtcNumber: string;
  callerWebrtcNumber: string;
  callerId: number;
  caller: User;
  calleeId: number;
  callee: User;
};

export type ChangeCallStatusPayload = {
  id: number;
  status: CallStatus;
};

export enum CallStatus {
  answerWaiting = 'answerWaiting',
  rejected = 'rejected',
  active = 'active',
  ended = 'ended',
  failed = 'failed',
}

export const StatusToTimestampDict = {
  [CallStatus.active]: 'startTimestamp',
  [CallStatus.ended]: 'endTimestamp',
  [CallStatus.rejected]: 'endTimestamp',
  [CallStatus.failed]: 'failedTimestamp',
};

export enum CallErrors {
  WrongCallerWebrtcNumber = 'WrongCallerWebrtcNumber',
  WrongCalleeWebrtcNumber = 'WrongCalleeWebrtcNumber',
  AgentOffline = 'AgentOffline',
  Busy = 'Busy',
}
