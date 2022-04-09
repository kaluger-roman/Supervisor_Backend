import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { WorkersPool } from 'src/workers/pool';
import { SR_POOL_LIFETIME, SR_POOL_NUMBER } from './constants';
import { SRMode, SROutput, SRResult, SRTask } from './types';

const SRProcessPath = resolve(
  'src',
  'SpeechRecognition',
  'scripts',
  'speechToText.process.js',
);

@Injectable()
export class SRService {
  srPool: WorkersPool<SRTask, SRResult>;
  constructor() {
    this.srPool = new WorkersPool({
      poolSize: SR_POOL_NUMBER,
      poolLifetime: SR_POOL_LIFETIME,
      processPath: SRProcessPath,
    });
  }

  async speechToText(src: string, mode: SRMode, id: string): Promise<SROutput> {
    return await new Promise((resolve) => {
      this.srPool.planTask({
        src,
        mode,
        callback: (res) => resolve({ ...res, id }),
      });
    });
  }
}
