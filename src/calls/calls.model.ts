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

  @Column({ defaultValue: [], type: DataType.ARRAY(DataType.BIGINT) })
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

  @Column({ type: DataType.BIGINT })
  startTimestamp: number;

  @Column({ type: DataType.BIGINT })
  endTimestamp: number;

  @BeforeUpdate
  @BeforeCreate
  static addStatus(instance) {
    if (instance.dataValues.status !== instance._previousDataValues.status) {
      instance.dataValues.statusSequence = [
        ...(instance._previousDataValues.statusSequence || []),
        instance.status,
      ];
      instance.dataValues.statusTimestampsSequence = [
        ...(instance._previousDataValues.statusTimestampsSequence || []),
        Date.now(),
      ];

      if (instance.dataValues.status === CallStatus.active) {
        instance.dataValues.startTimestamp = Date.now();
      }

      if (
        [CallStatus.ended, CallStatus.failed].includes(
          instance.dataValues.status,
        )
      ) {
        instance.dataValues.endTimestamp = Date.now();
      }
    }
  }
}
