export type AgentConfiguration = {
  iceServers: { urls: string }[];
};

export type MakeCallPayload = {
  number: number;
};

export type CallConnection = {
  caller: number;
  callee: number;
  peerCaller: RTCPeerConnection;
  peerCallee: RTCPeerConnection;
};

export type PeerConnectionsPullItem = {
  agentId: number;
  peerConnection: RTCPeerConnection;
};
