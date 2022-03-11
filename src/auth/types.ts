export type AuthPayload = {
  username: string;
  password: string;
  secret: string;
  secretAnswer: string;
  email: string;
};

export type AuthResponsePayload = {
  username: string;
  sub: number;
};

export type EmittedToken = {
  access_token: string;
};
