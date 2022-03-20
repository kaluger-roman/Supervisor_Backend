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

  @BelongsTo(() => User)
  caller: User;

  @ForeignKey(() => User)
  @Column
  calleeId: number;

  @BelongsTo(() => User)
  callee: User;

  @BeforeUpdate
  @BeforeCreate
  static addStatus(instance) {
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
