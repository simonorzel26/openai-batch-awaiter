import { Module } from '@nestjs/common';
import { CallWebhookService } from './call-webhook.service';
import { CallWebhookScheduler } from './call-webhook.scheduler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchEntity } from '../batch-awaiter/batch.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchEntity]),
    ScheduleModule.forRoot(), // Required for scheduling tasks
  ],
  providers: [CallWebhookService, CallWebhookScheduler],
})
export class CallWebhookModule {}
