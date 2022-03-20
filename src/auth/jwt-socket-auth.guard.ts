import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import jwt_decode from 'jwt-decode';
import { AuthResponsePayload } from './types';
import { User } from 'src/users/types';
import { roomPrefix } from './helpers';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authToken: string = client.handshake?.query?.token as string;
      const decoded = jwt_decode<AuthResponsePayload>(authToken);
      const user: Omit<User, 'passwordHash'> =
        await this.authService.validateUser(decoded.userId);
      client.join(roomPrefix(user.id));
      context.switchToWs().getData().user = user;

      return Boolean(user);
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
