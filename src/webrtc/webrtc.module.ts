import { forwardRef, Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { WebRTCService } from './webrtc.service';

@Module({
  imports: [forwardRef(() => EventsModule)],
  providers: [WebRTCService],
  exports: [WebRTCService],
})
export class WebRTCModule {}
