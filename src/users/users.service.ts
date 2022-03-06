import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './types';
import { User as UserModel } from './users.model';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { BCRYPT_SAULT } from './constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    private sequelize: Sequelize,
    private config: ConfigService,
  ) {}
  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByName(username: string): Promise<User | null> {
    return this.userModel.findOne({ where: { username } });
  }

  async createOne(username: string, password: string): Promise<User | null> {
    const isExist = await this.findByName(username);
    if (isExist) {
      throw new HttpException(
        'Такой пользователь уже существует(',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let user = null;
    await this.sequelize.transaction(async (t) => {
      user = await this.userModel.create(
        {
          username,
          passwordHash: bcrypt.hashSync(
            password,
            this.config.get<string>(BCRYPT_SAULT),
          ),
        },
        { transaction: t },
      );
    });

    return user;
  }
}
