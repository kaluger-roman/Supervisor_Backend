import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  IsEmail,
  Model,
  Table,
} from 'sequelize-typescript';
import { Roles, UserStatuses } from './types';
import { Secret } from './secrets.model';
import { Call } from 'src/calls/calls.model';

@Table
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  username: string;

  @Column({ defaultValue: UserStatuses.offline })
  status: UserStatuses;

  @Column
  passwordHash: string;

  @Column({ unique: true })
  webrtcNumber: string;

  @Column({ defaultValue: Roles.user })
  role: Roles;

  @Column
  secretAnswer: string;

  @IsEmail
  @Column
  email: string;

  @ForeignKey(() => Secret)
  @Column
  secretId: number;

  @BelongsTo(() => Secret)
  secret: Secret;

  @HasMany(() => Call)
  calls: Call[];
}
