import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BatchEntity } from '../batch-awaiter/batch.entity';
import fetch from 'node-fetch';

@Injectable()
export class CallWebhookService {
  constructor(
    @InjectRepository(BatchEntity)
    private batchRepository: Repository<BatchEntity>,
  ) {}

  async processCompletedBatches() {
    // Find all batches with the specified statuses
    const batches = await this.batchRepository.find({
      where: {
        status: In(['cancelled', 'expired', 'completed', 'failed']),
      },
    });
    // Detailed log for this file specific
    console.log('Batches to notify webhook:', batches);

    for (const batch of batches) {
      try {
        const response = await this.callWebhook(batch.webhookUrl, batch.status);
        
        if (response.ok) {
          // If the webhook call was successful, delete the batch from the database
          await this.batchRepository.remove(batch);
          console.log(`Batch ${batch.batchId} deleted successfully.`);
        } else {
          console.error(`Failed to notify webhook for batchId ${batch.batchId}:`, await response.text());
        }
      } catch (error) {
        console.error(`Error calling webhook for batchId ${batch.batchId}:`, error);
      }
    }
  }

  private async callWebhook(webhookUrl: string, status: string): Promise<Response> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status }),
      }) as unknown as Response;

      return response;
    } catch (error) {
      console.error('Error during webhook fetch:', error);
      throw new HttpException('Error calling webhook', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
