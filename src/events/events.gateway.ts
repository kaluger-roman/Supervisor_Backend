import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsJwtGuard } from 'src/auth/jwt-socket-auth.guard';
import { WithUser } from 'src/auth/types';
import {
  AnswerPayload,
  EndedPayload,
  FailedPayload,
  NewIceCandidate,
  OfferPayload,
} from 'src/webrtc/types';
import { WebRTCService } from 'src/webrtc/webrtc.service';
import { EVENT_TYPES } from './constants';

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
  async initCall(
    @MessageBody()
    payload: WithUser<OfferPayload>,
  ): Promise<void> {
    await this.webrtcService.handleOffer(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.ANSWER)
  async answerCall(
    @MessageBody()
    payload: WithUser<AnswerPayload>,
  ): Promise<void> {
    await this.webrtcService.handleAnswer(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.ENDED)
  async endCall(
    @MessageBody()
    payload: WithUser<EndedPayload>,
  ): Promise<void> {
    await this.webrtcService.handleEndCall(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.FAILED)
  async failedCall(
    @MessageBody()
    payload: WithUser<FailedPayload>,
  ): Promise<void> {
    await this.webrtcService.handleFailedCall(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.NEW_ICE)
  async handleWebrtcNewIce(
    @MessageBody() payload: WithUser<NewIceCandidate>,
  ): Promise<void> {
    await this.webrtcService.handleNewIce(payload);
  }
}
