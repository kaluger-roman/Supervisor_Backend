import { forwardRef, Module } from '@nestjs/common';
import { CallsModule } from 'src/calls/calls.module';
import { EventsModule } from 'src/events/events.module';
import { WebRTCService } from './webrtc.service';

@Module({
  imports: [forwardRef(() => EventsModule), forwardRef(() => CallsModule)],
  providers: [WebRTCService],
  exports: [WebRTCService],
})
export class WebRTCModule {}
