import { Body, Controller, Post } from '@nestjs/common';
import { ROUTES } from 'src/routes.constants';
import { FindUsersPayload, User } from './types';
import { UsersService } from './users.service';

@Controller(ROUTES.API.USERS.BASE)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async getUsers(@Body() body: FindUsersPayload): Promise<User[]> {
    return await this.usersService.findByFilters(body);
  }
}
