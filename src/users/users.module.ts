import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User as UserModel } from './users.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
