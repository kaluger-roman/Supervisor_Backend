export type CallConnection = {
  calleeWebrtcNumber: string;
  callerWebrtcNumber: string;
};

export type OfferPayload = {
  offer: RTCSessionDescriptionInit;
  callNumber: string;
};

export type AnswerPayload = {
  answer: RTCSessionDescriptionInit;
};

export type NewIceCandidate = { iceCandidate: RTCIceCandidate; callId: number };

export type EndedPayload = { callId: number };
