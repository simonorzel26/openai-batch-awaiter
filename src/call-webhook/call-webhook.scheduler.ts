import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CallWebhookService } from './call-webhook.service';

@Injectable()
export class CallWebhookScheduler {
  constructor(
    private readonly callWebhookService: CallWebhookService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    await this.callWebhookService.processCompletedBatches();
  }
}
