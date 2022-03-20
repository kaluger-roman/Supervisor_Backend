import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { roomPrefix } from 'src/auth/helpers';
import { WithUser } from 'src/auth/types';
import { CallsService } from 'src/calls/calls.service';
import { CallStatus } from 'src/calls/types';
import { EVENT_TYPES } from 'src/events/constants';
import { EventsGateway } from 'src/events/events.gateway';
import {
  AnswerPayload,
  EndedPayload,
  FailedPayload,
  NewIceCandidate,
  OfferPayload,
} from './types';

@Injectable()
export class WebRTCService {
  constructor(
    @Inject(forwardRef(() => EventsGateway))
    private eventsGateway: EventsGateway,
    private callsService: CallsService,
  ) {}

  async handleOffer(payload: WithUser<OfferPayload>) {
    const call = await this.callsService.createCall({
      calleeWebrtcNumber: payload.callNumber,
      callerWebrtcNumber: payload.user.webrtcNumber,
    });

    this.eventsGateway.server
      .to(roomPrefix(call.calleeId))
      .emit(EVENT_TYPES.SIGNALING.OFFER, {
        offer: payload.offer,
      });

    this.eventsGateway.server
      .to(roomPrefix(call.calleeId))
      .to(roomPrefix(call.callerId))
      .emit(EVENT_TYPES.CALL.CHANGE, {
        call,
      });
  }

  async handleAnswer(payload: WithUser<AnswerPayload>) {
    const existingCall = await this.callsService.findActiveCallByCallee(
      payload.user.webrtcNumber,
    );

    const updatedCall = await this.callsService.updateCallStatus({
      id: existingCall.id,
      status: CallStatus.active,
    });

    this.eventsGateway.server
      .to(roomPrefix(updatedCall.callerId))
      .emit(EVENT_TYPES.SIGNALING.ANSWER, {
        answer: payload.answer,
      });

    this.eventsGateway.server
      .to(roomPrefix(updatedCall.callerId))
      .to(roomPrefix(updatedCall.calleeId))
      .emit(EVENT_TYPES.CALL.CHANGE, {
        call: updatedCall,
      });
  }

  async handleEndCall(payload: WithUser<EndedPayload>) {
    const existingCall = await this.callsService.findCallById(payload.callId);

    if (!existingCall) {
      return;
    }

    this.callsService.updateCallStatus({
      status: CallStatus.ended,
      id: existingCall.id,
    });
  }

  async handleFailedCall(payload: WithUser<FailedPayload>) {
    const existingCall = await this.callsService.findCallById(payload.callId);

    if (!existingCall) {
      return;
    }

    this.callsService.updateCallStatus({
      status: CallStatus.failed,
      id: existingCall.id,
    });
  }

  async handleNewIce(payload: WithUser<NewIceCandidate>) {
    const existingCall = await this.callsService.findCallById(payload.callId);

    if (!existingCall) {
      return;
    }

    this.eventsGateway.server
      .to(
        roomPrefix(
          existingCall.calleeId === payload.user.id
            ? existingCall.callerId
            : existingCall.calleeId,
        ),
      )
      .emit(EVENT_TYPES.SIGNALING.NEW_ICE, {
        answer: payload.iceCandidate,
      });
  }
}
