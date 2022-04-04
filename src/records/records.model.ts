import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Call } from 'src/calls/calls.model';

@Table
export class Record extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  srcCaller: string;

  @Column
  srcCallee: string;

  @ForeignKey(() => Call)
  @Column
  callId: number;

  @BelongsTo(() => Call, 'callId')
  call: Call;
}
