import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_VARIABLES } from './constants';
import { Dialect } from 'sequelize/types';
import { InitModule } from './init/init.module';
import { WebRTCModule } from './webrtc/webrtc.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: config.get<Dialect>(DB_VARIABLES.DATABASE_DIALECT),
        host: config.get<string>(DB_VARIABLES.DATABASE_HOST),
        port: config.get<number>(DB_VARIABLES.DATABASE_PORT),
        username: config.get<string>(DB_VARIABLES.DATABASE_USER),
        password: config.get<string>(DB_VARIABLES.DATABASE_PASSWORD),
        database: config.get<string>(DB_VARIABLES.DATABASE_NAME),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    WebRTCModule,
    AuthModule,
    AgentModule,
    InitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
