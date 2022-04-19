import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CallsModule } from 'src/calls/calls.module';
import { SRModule } from 'src/SpeechRecognition/sr.module';
import { RecordsController } from './records.controller';
import { Record as RecordModel } from './records.model';
import { RecordsService } from './records.service';
import { Transcription as TranscriptionModel } from './transcription.model';

@Module({
  imports: [
    SequelizeModule.forFeature([RecordModel, TranscriptionModel]),
    CallsModule,
    SRModule,
  ],
  providers: [RecordsService],
  exports: [RecordsService],
  controllers: [RecordsController],
})
export class RecordsModule {}
