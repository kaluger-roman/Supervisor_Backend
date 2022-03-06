import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JWT_EXPIRES, JWT_SECRET_NAME } from './constants';

export type AuthPayload = {
  username: string;
  sub: number;
};

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(JWT_SECRET_NAME),
        signOptions: { expiresIn: JWT_EXPIRES },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
