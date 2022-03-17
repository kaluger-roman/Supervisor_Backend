import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsJwtGuard } from 'src/auth/jwt-socket-auth.guard';
import { WebRTCService } from 'src/webrtc/webrtc.service';
import { EVENT_TYPES } from './constants';
import { SignalStatus, SignalStatusResponse } from './types';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => WebRTCService))
    private webrtcService: WebRTCService,
  ) {}

  @SubscribeMessage(EVENT_TYPES.SIGNALING.OFFER)
  handleWebrtcOffer(
    @MessageBody() offer: RTCSessionDescriptionInit,
  ): WsResponse<SignalStatusResponse> {
    console.log(offer);

    //this.webrtcService.addPeerConnection(offer);

    return {
      event: EVENT_TYPES.SIGNALING.OFFER_RECEIVED,
      data: { status: SignalStatus.ok },
    };
  }
}
