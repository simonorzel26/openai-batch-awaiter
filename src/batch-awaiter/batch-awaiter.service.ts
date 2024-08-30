import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchEntity } from './batch.entity';

@Injectable()
export class BatchAwaiterService {
  constructor(
    @InjectRepository(BatchEntity)
    private batchRepository: Repository<BatchEntity>,
  ) {}

  async processBatch(batchId: string, webhookUrl: string): Promise<void> {
    if (!batchId || !webhookUrl) {
      console.error('Missing batchId or webhookUrl', { batchId, webhookUrl });
      throw new HttpException('Missing required fields: batchId and webhookUrl', HttpStatus.BAD_REQUEST);
    }

    // Store batchId and webhookUrl in the database
    const batch = new BatchEntity();
    batch.batchId = batchId;
    batch.webhookUrl = webhookUrl;
    await this.batchRepository.save(batch);

    // Simply return after storing the data
    return;
  }
}
