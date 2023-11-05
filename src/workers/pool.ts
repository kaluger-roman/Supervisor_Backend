import { fork } from 'child_process';
import { range } from 'lodash';
import * as yallist from 'yallist';
import { STANDARD_POOL_NUMBER, STANDARD_POOL_LIFETIME } from './constants';
import { PoolOptions, Task, Worker } from './types';

export class WorkersPool<T extends Task, U> {
  private pool: Worker[];
  private controller: AbortController;
  private taskSequence: yallist<T> = yallist.create();
  constructor(poolOptions: PoolOptions) {
    this.controller = new AbortController();
    this.pool = [];

    range(/*poolOptions.poolSize || */ STANDARD_POOL_NUMBER).forEach(() => {
      this.pool.push({
        worker: fork(poolOptions.processPath, [], {
          timeout: poolOptions.poolLifetime || STANDARD_POOL_LIFETIME,
          signal: this.controller.signal,
        }),
        isFree: true,
      });
    });
  }

  planTask(task: T) {
    this.taskSequence.push(task);
    console.log('task planned', task);

    this.tryRunTask();
  }

  tryRunTask() {
    const freeWorker = this.pool.find((worker) => worker.isFree);
    if (!freeWorker) return;

    const availableTask = this.taskSequence.shift();

    if (!availableTask) return;

    console.log(
      'task started',
      freeWorker?.worker?.pid,
      availableTask,
      `left: ${this.taskSequence.length}`,
    );

    freeWorker.isFree = false;

    const handler = (result: U) => {
      freeWorker.isFree = true;

      availableTask.callback(result);
      this.tryRunTask();

      console.log('task done', freeWorker.worker.pid, availableTask);

      freeWorker.worker.removeListener('message', handler);
      freeWorker.worker.removeListener('error', handlerError);
      freeWorker.worker.removeListener('close', handlerClose);
      freeWorker.worker.removeListener('disconnect', handlerDisconnect);
    };

    const handlerError = (e) => {
      console.log('error', freeWorker.worker.pid, e);
      freeWorker.worker.removeListener('error', handlerError);
    };
    const handlerClose = (e) => {
      console.log('close', freeWorker.worker.pid, e);
      freeWorker.worker.removeListener('close', handlerClose);
    };
    const handlerDisconnect = (e) => {
      console.log('disconnect', freeWorker.worker.pid, e);
      freeWorker.worker.removeListener('disconnect', handlerDisconnect);
    };
    const handlerExit = (e) => {
      console.log('exit', freeWorker.worker.pid, e);
      freeWorker.worker.removeListener('exit', handlerExit);
    };

    freeWorker.worker.addListener('message', handler);

    freeWorker.worker.addListener('error', handlerError);
    freeWorker.worker.addListener('close', handlerClose);
    freeWorker.worker.addListener('disconnect', handlerDisconnect);
    freeWorker.worker.addListener('exit', handlerExit);

    freeWorker.worker.send(availableTask);
  }

  shutdown() {
    this.controller.abort();
  }
}
