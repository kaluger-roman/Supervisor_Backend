import { Controller, Post, Req } from '@nestjs/common';
import { ReqWithUser } from 'src/auth/types';

import { ROUTES } from 'src/routes.constants';
import { UserStatuses } from 'src/users/types';
import { UsersService } from 'src/users/users.service';
import { ChangeStatusPayload } from './types';

@Controller(ROUTES.API.AGENT.BASE)
export class AgentController {
  constructor(private usersService: UsersService) {}

  @Post(ROUTES.API.AGENT.STATUS)
  async changeStatus(
    @Req() request: ReqWithUser<ChangeStatusPayload>,
  ): Promise<{ status: UserStatuses }> {
    const updatedUser = await this.usersService.updateStatus({
      ...request.body,
      user: request.user,
    });

    return { status: updatedUser.status };
  }
}
