import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User as UserModel } from 'src/users/users.model';
import { Secret as SecretModel } from 'src/users/secrets.model';
import { InitService } from './init.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, SecretModel])],
  providers: [InitService],
  exports: [InitService],
})
export class InitModule {}
