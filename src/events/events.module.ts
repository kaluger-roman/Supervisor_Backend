import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from 'src/casl/casl.module';
import { RecordsModule } from 'src/records/records.module';
import { WebRTCModule } from 'src/webrtc/webrtc.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    forwardRef(() => WebRTCModule),
    forwardRef(() => RecordsModule),
    AuthModule,
    CaslModule,
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
