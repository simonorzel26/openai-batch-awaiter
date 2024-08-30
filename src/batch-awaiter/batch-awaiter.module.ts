import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchAwaiterService } from './batch-awaiter.service';
import { BatchAwaiterController } from './batch-awaiter.controller';
import { BatchEntity } from './batch.entity';
import { BatchStatusCheckerService } from '../batch-status/batch-status-checker.service';
import { BatchStatusCheckerScheduler } from '../batch-status/batch-status-checker.scheduler';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchEntity]),
    ScheduleModule.forRoot(), // Required for scheduling tasks
  ],
  providers: [
    BatchAwaiterService,
    BatchStatusCheckerService,
    BatchStatusCheckerScheduler,
  ],
  controllers: [BatchAwaiterController],
})
export class BatchAwaiterModule {}