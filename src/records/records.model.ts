import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Call } from 'src/calls/calls.model';
import { Transcription } from './transcription.model';

@Table
export class Record extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  srcCaller: string;

  @Column
  srcCallee: string;

  @Column
  srcMerged: string;

  @HasMany(() => Transcription, 'transcriptionCallerId')
  transcriptionCaller: Transcription[];

  @HasMany(() => Transcription, 'transcriptionCalleeId')
  transcriptionCallee: Transcription[];

  @HasMany(() => Transcription, 'transcriptionCallerFluentId')
  transcriptionCallerFluent: Transcription[];

  @HasMany(() => Transcription, 'transcriptionCalleeFluentId')
  transcriptionCalleeFluent: Transcription[];

  @ForeignKey(() => Call)
  @Column
  callId: number;

  @BelongsTo(() => Call, 'callId')
  call: Call;
}
