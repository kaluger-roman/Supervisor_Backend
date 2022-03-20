import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User as UserModel } from 'src/users/users.model';
import { Secret as SecretModel } from 'src/users/secrets.model';

@Injectable()
export class InitService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(SecretModel)
    private secretModel: typeof SecretModel,
    private sequelize: Sequelize,
  ) {
    this.init();
  }
  async init() {
    //const usersCount = await this.userModel.count();
    const secretsCount = await this.secretModel.count();

    if (!secretsCount) {
      await this.secretModel.bulkCreate([
        { name: 'MOTHER' },
        { name: 'FIRST_PET' },
        { name: 'FAVOURITE_TEACHER' },
      ]);
    }
  }
}
