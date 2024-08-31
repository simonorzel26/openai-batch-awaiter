import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchAwaiterModule } from './batch-awaiter/batch-awaiter.module';
import { BatchEntity } from './batch-awaiter/batch.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DATABASE_URL || 'database.sqlite',
      entities: [BatchEntity],
      synchronize: true,
    }),
    BatchAwaiterModule,
  ],
})
export class AppModule {}
