import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BatchStatusCheckerService } from './batch-status-checker.service';

@Injectable()
export class BatchStatusCheckerScheduler {
  constructor(
    private readonly batchStatusCheckerService: BatchStatusCheckerService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.batchStatusCheckerService.checkAllBatchesStatus();
  }
}
