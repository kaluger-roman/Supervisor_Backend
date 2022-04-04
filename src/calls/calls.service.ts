import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Call as CallModel } from './calls.model';
import {
  CallErrors,
  CallType,
  CallStatus,
  ChangeCallStatusPayload,
} from './types';
import { CallConnection } from 'src/webrtc/types';
import { UsersService } from 'src/users/users.service';
import { Op } from 'sequelize';
import { UserStatuses } from 'src/users/types';
import { WsException } from '@nestjs/websockets';
import { User as UserModel } from 'src/users/users.model';

const ACTIVE_FINDER = {
  [Op.in]: [CallStatus.answerWaiting, CallStatus.active],
};

@Injectable()
export class CallsService implements BeforeApplicationShutdown {
  constructor(
    @InjectModel(CallModel)
    private callModel: typeof CallModel,
    private usersService: UsersService,
    private sequelize: Sequelize,
  ) {}

  async beforeApplicationShutdown() {
    await this.callModel.update(
      {
        status: CallStatus.failed,
      },
      {
        where: {
          status: ACTIVE_FINDER,
        },
        individualHooks: true,
      },
    );
  }

  async findCallById(id: number): Promise<CallType | null> {
    return await this.callModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'callee',
        },
        {
          model: UserModel,
          as: 'caller',
        },
      ],
    });
  }

  async findActiveCallByCallee(
    calleeWebrtcNumber: string,
  ): Promise<CallType | null> {
    return this.callModel.findOne({
      where: {
        [Op.and]: [
          { calleeWebrtcNumber },
          {
            status: ACTIVE_FINDER,
          },
        ],
      },
    });
  }

  async findActiveCallBySides(
    callerWebrtcNumber: string,
    calleeWebrtcNumber: string,
  ): Promise<CallType | null> {
    return this.callModel.findOne({
      where: {
        [Op.and]: [
          { callerWebrtcNumber },
          { calleeWebrtcNumber },
          {
            status: ACTIVE_FINDER,
          },
        ],
      },
    });
  }

  async createCall(callPayload: CallConnection): Promise<CallType | null> {
    let call = null;

    const caller = await this.usersService.findOneByWebrtcNumber(
      callPayload.callerWebrtcNumber,
    );

    const callee = await this.usersService.findOneByWebrtcNumber(
      callPayload.calleeWebrtcNumber,
    );

    if (!caller) {
      throw new WsException(CallErrors.WrongCallerWebrtcNumber);
    }

    if (!callee) {
      throw new WsException(CallErrors.WrongCalleeWebrtcNumber);
    }

    if (callee.status === UserStatuses.offline) {
      throw new WsException(CallErrors.AgentOffline);
    }

    if (callee.status === UserStatuses.away) {
      throw new WsException(CallErrors.AgentAway);
    }

    const activeCall = await this.findActiveCallBySides(
      callPayload.callerWebrtcNumber,
      callPayload.calleeWebrtcNumber,
    );

    if (activeCall) {
      throw new WsException(CallErrors.Busy);
    }

    await this.sequelize.transaction(async (t) => {
      call = await this.callModel.create(
        {
          ...callPayload,
          status: CallStatus.answerWaiting,
          callerId: caller.id,
          calleeId: callee.id,
        },
        { transaction: t, individualHooks: true },
      );
    });

    return await this.findCallById(call.id);
  }

  async updateCallStatus(
    payload: ChangeCallStatusPayload,
  ): Promise<CallType | null> {
    await this.sequelize.transaction(async (t) => {
      await this.callModel.update(
        {
          status: payload.status,
        },
        {
          where: {
            id: payload.id,
          },
          transaction: t,
          individualHooks: true,
        },
      );
    });

    return await this.findCallById(payload.id);
  }

  async addRecord(recordId: number, callId: number): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      await this.callModel.update(
        {
          recordId,
        },
        {
          where: {
            id: callId,
          },
          transaction: t,
        },
      );
    });
  }
}
