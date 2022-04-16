import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecordFilters } from './types';

@Controller('api/records')
export class AppController {
  @Get()
  getRecords(@Body() body: RecordFilters): string {
    return '';
  }
}
