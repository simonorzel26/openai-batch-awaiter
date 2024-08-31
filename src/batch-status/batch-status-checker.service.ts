import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { BatchEntity } from '../batch-awaiter/batch.entity';
import OpenAI from 'openai';

@Injectable()
export class BatchStatusCheckerService {
  private openai = new OpenAI();

  constructor(
    @InjectRepository(BatchEntity)
    private batchRepository: Repository<BatchEntity>,
  ) {}

  async checkAllBatchesStatus() {
    const batches = await this.batchRepository.find({
      where: {
        status: Not(In(['cancelled', 'expired', 'completed', 'failed'])),
      },
    });
    console.log('batches', batches);

    for (const batch of batches) {
      try {
        const batchDetails = await this.checkBatchStatus(batch.batchId);
        this.handleBatchStatus(batch, batchDetails.status);
      } catch (error) {
        console.error(
          `Error checking batch status for batchId ${batch.batchId}:`,
          error,
        );
      }
    }
  }

  private async checkBatchStatus(batchId: string): Promise<any> {
    const batch = await this.openai.batches.retrieve(batchId);
    return batch;
  }

  private async handleBatchStatus(batch: BatchEntity, status: string) {
    switch (status) {
      case 'validating':
        batch.status = 'validating';
        console.log(`Batch ${batch.batchId} is currently validating.`);
        break;
      case 'failed':
        batch.status = 'failed';
        console.error(`Batch ${batch.batchId} failed validation.`);
        break;
      case 'in_progress':
        batch.status = 'in_progress';
        console.log(`Batch ${batch.batchId} is in progress.`);
        break;
      case 'finalizing':
        batch.status = 'finalizing';
        console.log(`Batch ${batch.batchId} is finalizing.`);
        break;
      case 'completed':
        batch.status = 'completed';
        console.log(`Batch ${batch.batchId} has completed.`);
        // You may want to retrieve and process results here.
        break;
      case 'expired':
        batch.status = 'expired';
        console.warn(`Batch ${batch.batchId} has expired.`);
        break;
      case 'cancelling':
        batch.status = 'cancelling';
        console.log(`Batch ${batch.batchId} is being cancelled.`);
        break;
      case 'cancelled':
        batch.status = 'cancelled';
        console.log(`Batch ${batch.batchId} was cancelled.`);
        break;
      default:
        console.warn(`Batch ${batch.batchId} has an unknown status: ${status}`);
    }

    await this.batchRepository.save(batch);
  }
}
