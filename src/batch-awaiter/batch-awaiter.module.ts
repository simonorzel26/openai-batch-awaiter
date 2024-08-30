import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchAwaiterService } from './batch-awaiter.service';
import { BatchAwaiterController } from './batch-awaiter.controller';
import { BatchEntity } from './batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchEntity])],
  providers: [BatchAwaiterService],
  controllers: [BatchAwaiterController],
})
export class BatchAwaiterModule {}
