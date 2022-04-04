import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CheckPolicies } from 'src/casl/casl.decorator';
import { PoliciesGuard } from 'src/casl/casl.guard';
import { Action, AppAbility } from 'src/casl/types';

@Controller('api/records')
export class AppController {
  @Get()
  getRecord(): string {
    return '';
  }
  @Post()
  saveRecord(): string {
    return '';
  }
}
