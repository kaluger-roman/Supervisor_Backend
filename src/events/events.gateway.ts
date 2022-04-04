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
  CallIDPayload,
  NewIceCandidate,
  OfferPayload,
} from 'src/webrtc/types';
import { WebRTCService } from 'src/webrtc/webrtc.service';
import { EVENT_TYPES } from './constants';
import { CallStatus } from 'src/calls/types';
import { consoleBlue } from 'helpers/coloredConsole';
import { RecordsService } from 'src/records/records.service';
import { AppendRecordPayload } from 'src/records/types';

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
    @Inject(forwardRef(() => RecordsService))
    private recordsService: RecordsService,
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
    payload: WithUser<CallIDPayload>,
  ): Promise<void> {
    await this.webrtcService.handleEndCall(payload, CallStatus.ended);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.CANCEL)
  async cancelCall(
    @MessageBody()
    payload: WithUser<CallIDPayload>,
  ): Promise<void> {
    await this.webrtcService.handleEndCall(payload, CallStatus.cancelled);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.REJECT)
  async RejectCall(
    @MessageBody()
    payload: WithUser<CallIDPayload>,
  ): Promise<void> {
    await this.webrtcService.handleEndCall(payload, CallStatus.rejected);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.FAILED)
  async failedCall(
    @MessageBody()
    payload: WithUser<CallIDPayload>,
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

  @SubscribeMessage(EVENT_TYPES.RECORD.START)
  startRecord(@MessageBody() payload: WithUser<CallIDPayload>): void {
    this.recordsService.createRecord(payload);
  }

  @SubscribeMessage(EVENT_TYPES.RECORD.APPEND)
  appendRecord(@MessageBody() payload: WithUser<AppendRecordPayload>): void {
    this.recordsService.appendRecord(payload);
  }

  @SubscribeMessage(EVENT_TYPES.RECORD.STOP)
  stopRecord(@MessageBody() payload: WithUser<CallIDPayload>): void {
    this.recordsService.stopRecord(payload);
  }
}
