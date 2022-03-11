import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User as UserModel } from './users.model';
import { Secret as SecretModel } from './secrets.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, SecretModel])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
