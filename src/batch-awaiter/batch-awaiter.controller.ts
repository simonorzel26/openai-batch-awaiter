import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BatchAwaiterService } from './batch-awaiter.service';

@Controller('batch-awaiter')
export class BatchAwaiterController {
  constructor(private readonly batchAwaiterService: BatchAwaiterService) {}

  @Post()
  async handleBatch(
    @Body() body: { id: string; webhookUrl: string },
  ): Promise<{ message: string }> {
    const { id, webhookUrl } = body;
    try {
      await this.batchAwaiterService.processBatch(id, webhookUrl);
      return {
        message: 'Operation in progress, webhook will be called once done',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred during processing',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }
}
