import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fetch from 'node-fetch';
import { BatchEntity } from '../batch-awaiter/batch.entity';

@Injectable()
export class BatchStatusCheckerService {
  constructor(
    @InjectRepository(BatchEntity)
    private batchRepository: Repository<BatchEntity>,
  ) {}

  async checkAllBatchesStatus() {
    const batches = await this.batchRepository.find({ where: { status: 'in_progress' } });
    console.log('batches', batches);

    for (const batch of batches) {
      try {
        const updatedStatus = await this.checkBatchStatus(batch.batchId);

        if (updatedStatus === 'completed') {
          const result = await this.retrieveBatchResult(batch.batchId);

          batch.status = 'completed';
          batch.result = result;
          await this.batchRepository.save(batch);

          await this.callWebhook(batch.webhookUrl, result);
        } else if (updatedStatus !== batch.status) {
          batch.status = updatedStatus;
          await this.batchRepository.save(batch);
        }
      } catch (error) {
        console.error(`Error checking batch status for batchId ${batch.batchId}:`, error);
      }
    }
  }

  private async checkBatchStatus(batchId: string): Promise<string> {
    // Replace this with the actual API call to check batch status
    const status = 'completed'; // Example: in_progress, completed, etc.
    return status;
  }

  private async retrieveBatchResult(batchId: string): Promise<string> {
    // Replace this with the actual logic to retrieve the result from OpenAI or your API
    const result = 'Batch result data'; // Placeholder
    return result;
  }

  private async callWebhook(webhookUrl: string, result: string) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });

      if (!response.ok) {
        console.error('Failed to send data to webhook', await response.text());
        throw new HttpException('Failed to send data to webhook', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      throw new HttpException('Error sending webhook', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
