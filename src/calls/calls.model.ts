import { isEqual } from 'lodash';
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Record } from 'src/records/records.model';
import { User } from 'src/users/users.model';
import { CallStatus } from './types';

@Table
export class Call extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  status: CallStatus;

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

  @BelongsTo(() => User, 'callerId')
  caller: User;

  @ForeignKey(() => User)
  @Column
  calleeId: number;

  @BelongsTo(() => User, 'calleeId')
  callee: User;

  @ForeignKey(() => Record)
  @Column
  recordId: number;

  @HasOne(() => Record, 'recordId')
  record: Record;

  @BeforeUpdate
  @BeforeCreate
  static addStatus(instance) {
    if (
      !isEqual(
        instance.dataValues.statusSequence,
        instance._previousDataValues.statusSequence,
      )
    ) {
      instance.dataValues.statusSequence = [
        ...(instance._previousDataValues.statusSequence || []),
        instance.status,
      ];
      instance.dataValues.statusTimestampsSequence = [
        ...(instance._previousDataValues.statusTimestampsSequence || []),
        Date.now(),
      ];
    }
  }
}
