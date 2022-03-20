import {
  BeforeApplicationShutdown,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Call as CallModel } from './calls.model';
import { CallRecord, CallStatus, ChangeCallStatusPayload } from './types';
import { CallConnection } from 'src/webrtc/types';
import { UsersService } from 'src/users/users.service';
import { Op } from 'sequelize';

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

  async findCallById(id: number): Promise<CallRecord | null> {
    return this.callModel.findByPk(id);
  }

  async findActiveCallByCallee(
    celleeWebrtcNumber: string,
  ): Promise<CallRecord | null> {
    return this.callModel.findOne({
      where: {
        [Op.and]: [
          { celleeWebrtcNumber },
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
  ): Promise<CallRecord | null> {
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

  async createCall(callPayload: CallConnection): Promise<CallRecord | null> {
    const activeCall = await this.findActiveCallBySides(
      callPayload.callerWebrtcNumber,
      callPayload.calleeWebrtcNumber,
    );

    if (activeCall) {
      throw new HttpException(
        {
          all: 'Busy',
        },
        HttpStatus.ACCEPTED,
      );
    }

    let callRecord = null;

    const caller = await this.usersService.findOneByWebrtcNumber(
      callPayload.callerWebrtcNumber,
    );

    const callee = await this.usersService.findOneByWebrtcNumber(
      callPayload.calleeWebrtcNumber,
    );

    if (!caller) {
      throw new HttpException(
        {
          all: 'Неверный callerWebrtcNumber',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!callee) {
      throw new HttpException(
        {
          all: 'Неверный calleeWebrtcNumber',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.sequelize.transaction(async (t) => {
      callRecord = await this.callModel.create(
        {
          ...callPayload,
          status: CallStatus.answerWaiting,
        },
        { transaction: t, individualHooks: true },
      );

      await callRecord.setCaller(caller);
      await callRecord.setCallee(callee);
    });

    return callRecord;
  }

  async updateCallStatus(
    payload: ChangeCallStatusPayload,
  ): Promise<CallRecord | null> {
    let updatedCallRecord = null;

    await this.sequelize.transaction(async (t) => {
      updatedCallRecord = await this.callModel.update(
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

    return updatedCallRecord;
  }
}
