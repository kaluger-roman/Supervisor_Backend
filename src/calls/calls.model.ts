import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { CallStatus } from './types';

@Table
export class Call extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ defaultValue: [], type: DataType.ARRAY(DataType.STRING) })
  statusSequence: CallStatus[];

  @Column({ defaultValue: [], type: DataType.ARRAY(DataType.STRING) })
  statusTimestampsSequence: number[];

  @Column
  calleeWebrtcNumber: string;

  @Column
  callerWebrtcNumber: string;

  @ForeignKey(() => User)
  @Column
  callerId: number;

  @BelongsTo(() => User)
  caller: User;

  @ForeignKey(() => User)
  @Column
  calleeId: number;

  @BelongsTo(() => User)
  callee: User;

  @BeforeUpdate
  @BeforeCreate
  static addStatusTimestamp(instance: Call) {
    instance.statusTimestampsSequence = [
      ...instance.previous().statusTimestampsSequence,
      Date.now(),
    ];
  }
}
