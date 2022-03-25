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
  NewIceCandidate,
  OfferPayload,
} from 'src/webrtc/types';
import { WebRTCService } from 'src/webrtc/webrtc.service';
import { EVENT_TYPES } from './constants';
import { CallStatus } from 'src/calls/types';
import { consoleBlue } from 'helpers/coloredConsole';

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
    await this.webrtcService.handleEndCall(payload, CallStatus.ended);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.CANCEL)
  async cancelCall(
    @MessageBody()
    payload: WithUser<EndedPayload>,
  ): Promise<void> {
    await this.webrtcService.handleEndCall(payload, CallStatus.cancelled);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.FAILED)
  async failedCall(
    @MessageBody()
    payload: WithUser<EndedPayload>,
  ): Promise<void> {
    await this.webrtcService.handleEndCall(payload, CallStatus.failed);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.NEW_ICE)
  async handleWebrtcNewIce(
    @MessageBody() payload: WithUser<NewIceCandidate>,
  ): Promise<void> {
    await this.webrtcService.handleNewIce(payload);
  }

  @SubscribeMessage(EVENT_TYPES.INIT)
  iniSocket(@MessageBody() payload: WithUser<object>): void {
    consoleBlue(`User ${payload.user.username} registered in socket`);
  }
}
