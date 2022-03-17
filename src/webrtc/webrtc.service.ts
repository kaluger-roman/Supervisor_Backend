import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EVENT_TYPES } from 'src/events/constants';
import { EventsGateway } from 'src/events/events.gateway';
import { AgentConfiguration, PeerConnectionsPullItem } from './types';

@Injectable()
export class WebRTCService {
  configuration: AgentConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };
  peerConnectionsPull: PeerConnectionsPullItem[];

  constructor(
    @Inject(forwardRef(() => EventsGateway))
    private eventsGateway: EventsGateway,
  ) {
    //this.peerConnection = new RTCPeerConnection(this.configuration);
    //   EventSocket.socket.on(
    //     EVENT_TYPES.SIGNALING.ANSWER,
    //     async (data: { answer: RTCSessionDescriptionInit }) => {
    //       if (data.answer) {
    //         const remoteDesc = new RTCSessionDescription(data.answer);
    //         await this.peerConnection.setRemoteDescription(remoteDesc);
    //       }
    //     },
    //   );
    //   EventSocket.socket.on(EVENT_TYPES.SIGNALING.NEW_ICE, async (message) => {
    //     if (message.iceCandidate) {
    //       try {
    //         await this.peerConnection.addIceCandidate(message.iceCandidate);
    //       } catch (e) {
    //         console.error('Error adding received ice candidate', e);
    //       }
    //     }
    //   });
    //   this.peerConnection.addEventListener('icecandidate', (event) => {
    //     if (event.candidate) {
    //       EventSocket.socket.emit(EVENT_TYPES.SIGNALING.NEW_ICE, {
    //         candidate: event.candidate,
    //       });
    //     }
    //   });
    // }
    // async createOfferConnection() {
    //   const offer = await this.peerConnection.createOffer();
    //   await this.peerConnection.setLocalDescription(offer);
    //   EventSocket.socket.emit(EVENT_TYPES.SIGNALING.OFFER, { offer: offer });
    // }
    // async attachAudioToConnection() {
    //   if (this.localAudioStream) {
    //     this.localAudioStream.getTracks().forEach((track) => {
    //       this.attachedTrack = this.peerConnection.addTrack(
    //         track,
    //         this.localAudioStream!,
    //       );
    //     });
    //   }
    // }
    // async removeAudioFromConnection() {
    //   if (this.attachedTrack) {
    //     this.peerConnection.removeTrack(this.attachedTrack);
    //   }
  }

  async addPeerConnection(rtcOffer: RTCSessionDescriptionInit) {
    const peerConnection = new RTCPeerConnection(this.configuration);

    //this.peerConnectionsPull.push();

    peerConnection.setRemoteDescription(new RTCSessionDescription(rtcOffer));

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);

    this.eventsGateway.server.emit(EVENT_TYPES.SIGNALING.ANSWER, {
      answer: answer,
    });
  }
}
