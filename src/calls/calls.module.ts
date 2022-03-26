import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CallsService } from './calls.service';
import { Call as CallModel } from './calls.model';
import { UsersModule } from 'src/users/users.module';
import { User as UserModel } from 'src/users/users.model';

@Module({
  imports: [SequelizeModule.forFeature([CallModel, UserModel]), UsersModule],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
