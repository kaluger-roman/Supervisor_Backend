import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Record } from './records.model';

@Table
export class Transcription extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.DECIMAL })
  conf: number;

  @Column({ type: DataType.DECIMAL })
  start: number;

  @Column({ type: DataType.DECIMAL })
  end: number;

  @Column
  word: string;

  @Column
  type: string;

  @Column({ defaultValue: 0 })
  crimeMeaningSynonymRate: number;

  @Column({ defaultValue: 0 })
  crimeMeaningW2VRate: number;

  @ForeignKey(() => Record)
  @Column
  transcriptionCallerId: number;

  @ForeignKey(() => Record)
  @Column
  transcriptionCalleeId: number;

  @ForeignKey(() => Record)
  @Column
  transcriptionCallerFluentId: number;

  @ForeignKey(() => Record)
  @Column
  transcriptionCalleeFluentId: number;

  @BelongsTo(() => Record, 'recordId')
  record: Record;
}
