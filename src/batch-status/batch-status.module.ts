import { Module } from '@nestjs/common';
import { BatchStatusCheckerService } from './batch-status-checker.service';
import { BatchStatusCheckerScheduler } from './batch-status-checker.scheduler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchEntity } from '../batch-awaiter/batch.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchEntity]),
    ScheduleModule.forRoot(), // Required for scheduling tasks
  ],
  providers: [BatchStatusCheckerService, BatchStatusCheckerScheduler],
})
export class BatchStatusModule {}
