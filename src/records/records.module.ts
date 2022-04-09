import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CallsModule } from 'src/calls/calls.module';
import { SRModule } from 'src/SpeechRecognition/sr.module';
import { Record as RecordModel } from './records.model';
import { RecordsService } from './records.service';

@Module({
  imports: [SequelizeModule.forFeature([RecordModel]), CallsModule, SRModule],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
