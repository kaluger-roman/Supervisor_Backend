import { Roles } from 'src/users/types';

export type AuthPayload = {
  username: string;
  password: string;
  secret: string;
  secretAnswer: string;
  email: string;
};

export type AuthResponsePayload = {
  userName: string;
  userId: number;
  role: Roles;
};

export type EmittedToken = {
  access_token: string;
};
