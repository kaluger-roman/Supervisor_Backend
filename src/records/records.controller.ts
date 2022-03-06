import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CheckPolicies } from 'src/casl/casl.decorator';
import { PoliciesGuard } from 'src/casl/casl.guard';
import { Action, AppAbility } from 'src/casl/types';
import { Record } from './records.module';

@Controller('api/records')
export class AppController {
  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Record))
  getRecord(): string {
    return '';
  }
  @Post()
  saveRecord(): string {
    return '';
  }
}
