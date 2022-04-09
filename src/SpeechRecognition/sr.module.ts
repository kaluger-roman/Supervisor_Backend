import { Module } from '@nestjs/common';
import { SRService } from './sr.service';

@Module({
  imports: [],
  providers: [SRService],
  exports: [SRService],
})
export class SRModule {}
