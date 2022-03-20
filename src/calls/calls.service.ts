import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
export class CallsService {
  constructor(
    @InjectModel(CallModel)
    private callModel: typeof CallModel,
    private usersService: UsersService,
    private sequelize: Sequelize,
  ) {}
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
            statusSequence: ACTIVE_FINDER,
          },
        ],
      },
    });
  }

  async findActiveCallBySides(
    cellerWebrtcNumber: string,
    celleeWebrtcNumber: string,
  ): Promise<CallRecord | null> {
    return this.callModel.findOne({
      where: {
        [Op.and]: [
          { cellerWebrtcNumber },
          { celleeWebrtcNumber },
          {
            statusSequence: ACTIVE_FINDER,
          },
        ],
      },
    });
  }

  async createCall(callPayload: CallConnection): Promise<CallRecord | null> {
    const activeCall = this.findActiveCallBySides(
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

    const caller = this.usersService.findOneByWebrtcNumber(
      callPayload.callerWebrtcNumber,
    );
    const callee = this.usersService.findOneByWebrtcNumber(
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
          statusSequence: [CallStatus.answerWaiting],
        },
        { transaction: t, individualHooks: true },
      );

      callRecord.addCaller(caller);
      callRecord.addCallee(callee);
    });

    return callRecord;
  }

  async updateCallStatus(
    payload: ChangeCallStatusPayload,
  ): Promise<CallRecord | null> {
    const callRecord = await this.findCallById(payload.id);

    if (!callRecord) {
      throw new HttpException(
        {
          all: 'Неверный id',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let updatedCallRecord = null;

    await this.sequelize.transaction(async (t) => {
      updatedCallRecord = await this.callModel.update(
        {
          statusSequence: [...callRecord.statusSequence, payload.status],
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
