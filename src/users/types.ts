import { Secret } from './secrets.model';

export const enum Roles {
  admin = 'admin',
  user = 'user',
  supervisor = 'supervisor',
}

export class User {
  id: number;
  username: string;
  passwordHash: string;
  role: Roles;
  secret: Secret;
  secretAnswer: string;
  email: string;
}
