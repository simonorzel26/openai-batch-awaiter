import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchAwaiterModule } from './batch-awaiter/batch-awaiter.module';
import { BatchEntity } from './batch-awaiter/batch.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [BatchEntity],
      synchronize: true, // Automatically sync entities with the database (not recommended in production)
    }),
    BatchAwaiterModule,
  ],
})
export class AppModule {}
