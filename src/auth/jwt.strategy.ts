import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthPayload } from './auth.module';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET_NAME } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>(JWT_SECRET_NAME),
    });
  }

  async validate(payload: AuthPayload) {
    return this.authService.validateUser(payload.sub);
  }
}
