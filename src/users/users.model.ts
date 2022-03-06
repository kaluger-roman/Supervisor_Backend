import { Column, Model, Table } from 'sequelize-typescript';
import { Roles } from './types';

@Table
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  username: string;

  @Column
  passwordHash: string;

  @Column({ defaultValue: Roles.user })
  role: Roles;
}
