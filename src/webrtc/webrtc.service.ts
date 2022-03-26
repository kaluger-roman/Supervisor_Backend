import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { roomPrefix } from 'src/auth/helpers';
import { WithUser } from 'src/auth/types';
import { CallsService } from 'src/calls/calls.service';
import { CallStatus } from 'src/calls/types';
import { EVENT_TYPES } from 'src/events/constants';
import { EventsGateway } from 'src/events/events.gateway';
import { TIME_EXCEED_LIMIT } from './constants';
import {
  AnswerPayload,
  EndedPayload,
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

  async checkTimeExceed(callId: number) {
    setTimeout(async () => {
      const call = await this.callsService.findCallById(callId);

      if (call && call.status === CallStatus.answerWaiting) {
        this.callsService.updateCallStatus({
          status: CallStatus.timeExceeded,
          id: callId,
        });

        this.eventsGateway.server
          .to(roomPrefix(call.calleeId))
          .to(roomPrefix(call.callerId))
          .emit(EVENT_TYPES.SIGNALING.TIME_EXCEED);
      }
    }, TIME_EXCEED_LIMIT);
  }

  async handleOffer(payload: WithUser<OfferPayload>) {
    const call = await this.callsService.createCall({
      calleeWebrtcNumber: payload.callNumber,
      callerWebrtcNumber: payload.user.webrtcNumber,
    });

    this.checkTimeExceed(call.id);

    this.eventsGateway.server
      .to(roomPrefix(call.calleeId))
      .emit(EVENT_TYPES.SIGNALING.OFFER, {
        offer: payload.offer,
      });

    this.eventsGateway.server
      .to(roomPrefix(call.calleeId))
      .to(roomPrefix(call.callerId))
      .emit(EVENT_TYPES.CALL.CHANGE, {
        call: {
          callee: pick(call.callee, ['username', 'webrtcNumber', 'id']),
          caller: pick(call.caller, ['username', 'webrtcNumber', 'id']),
          ...pick(call, [
            'status',
            'statusSequence',
            'statusTimestampsSequence',
            'id',
          ]),
        },
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

  async handleEndCall(payload: WithUser<EndedPayload>, status: CallStatus) {
    const existingCall = await this.callsService.findCallById(payload.callId);

    if (!existingCall) {
      return;
    }

    this.callsService.updateCallStatus({
      status,
      id: existingCall.id,
    });

    if (status === CallStatus.cancelled) {
      this.eventsGateway.server
        .to(roomPrefix(existingCall.calleeId))
        .emit(EVENT_TYPES.SIGNALING.CANCEL);
    }

    if (status === CallStatus.rejected) {
      this.eventsGateway.server
        .to(roomPrefix(existingCall.callerId))
        .emit(EVENT_TYPES.SIGNALING.REJECT);
    }

    if (status === CallStatus.ended) {
      const otherSide = [existingCall.callee, existingCall.caller].find(
        (side) => side.id !== payload.user.id,
      );

      this.eventsGateway.server
        .to(roomPrefix(otherSide.id))
        .emit(EVENT_TYPES.SIGNALING.ENDED);
    }

    this.eventsGateway.server
      .to(roomPrefix(existingCall.calleeId))
      .to(roomPrefix(existingCall.callerId))
      .emit(EVENT_TYPES.CALL.CHANGE, { call: null });
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
        iceCandidate: payload.iceCandidate,
      });
  }
}
