import { Injectable } from '@nestjs/common';
import { InitService } from './init/init.service';

@Injectable()
export class AppService {
  constructor(private initService: InitService) {}
}
