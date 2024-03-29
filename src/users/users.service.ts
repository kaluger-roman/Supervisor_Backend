import {
  BeforeApplicationShutdown,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { FindUsersPayload, User, UserStatuses } from './types';
import { User as UserModel } from './users.model';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { BCRYPT_SAULT } from './constants';
import { AuthPayload, WithUser } from 'src/auth/types';
import { Op } from 'sequelize';
import { Secret as SecretModel } from './secrets.model';
import { ChangeStatusPayload } from 'src/agent/types';
import { Where } from 'sequelize/types/utils';

@Injectable()
export class UsersService implements BeforeApplicationShutdown {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(SecretModel)
    private secretModel: typeof SecretModel,
    private sequelize: Sequelize,
    private config: ConfigService,
  ) {}

  async beforeApplicationShutdown() {
    await this.userModel.update(
      {
        status: UserStatuses.offline,
      },
      {
        where: {
          status: { [Op.not]: UserStatuses.offline },
        },
      },
    );
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findOneByWebrtcNumber(webrtcNumber: string): Promise<User | null> {
    return this.userModel.findOne({ where: { webrtcNumber: webrtcNumber } });
  }

  async findByFilters(payload: FindUsersPayload): Promise<User[]> {
    const where: { [key: string]: Where } = {};

    if (payload.username) {
      where.username = this.sequelize.where(
        this.sequelize.fn('LOWER', this.sequelize.col('username')),
        'LIKE',
        '%' + payload.username.toLowerCase() + '%',
      );
    }

    return this.userModel.findAll({
      where,
      limit: payload.limit ? Number(payload.limit) : undefined,
    });
  }

  async findByNameAndEmail(
    username: string,
    email?: string,
  ): Promise<User | null> {
    const filterhObj = email
      ? { [Op.or]: [{ username }, { email }] }
      : { username };

    return this.userModel.findOne({ where: filterhObj });
  }

  async createOne(authPayload: AuthPayload): Promise<User | null> {
    const isExist = await this.findByNameAndEmail(
      authPayload.username,
      authPayload.email,
    );

    if (isExist) {
      throw new HttpException(
        {
          all: 'Такой пользователь уже существует',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let user = null;
    const password = authPayload.password;

    delete authPayload.password;
    await this.sequelize.transaction(async (t) => {
      user = await this.userModel.create(
        {
          ...authPayload,
          passwordHash: bcrypt.hashSync(
            password,
            this.config.get<string>(BCRYPT_SAULT),
          ),
        },
        { transaction: t },
      );

      const secret = await this.secretModel.findOne({
        where: { name: authPayload.secret },
      });

      user.setSecret(secret);
    });

    return user;
  }

  async updateStatus(
    changeStatusPayload: WithUser<ChangeStatusPayload>,
  ): Promise<User | null> {
    let updatedUser: User | null = null;

    await this.sequelize.transaction(async (t) => {
      const [_, user] = await this.userModel.update(
        {
          status: changeStatusPayload.status,
        },
        {
          where: {
            id: changeStatusPayload.user.id,
          },
          returning: true,
          transaction: t,
        },
      );

      if (user) updatedUser = user[0];
    });

    return updatedUser;
  }
}
