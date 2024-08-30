import { Test, TestingModule } from '@nestjs/testing';
import { BatchAwaiterController } from './batch-awaiter.controller';
import { BatchAwaiterService } from './batch-awaiter.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BatchAwaiterController', () => {
  let controller: BatchAwaiterController;
  let service: BatchAwaiterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchAwaiterController],
      providers: [
        {
          provide: BatchAwaiterService,
          useValue: {
            processBatch: jest.fn(), // Mock the processBatch method
          },
        },
      ],
    }).compile();

    controller = module.get<BatchAwaiterController>(BatchAwaiterController);
    service = module.get<BatchAwaiterService>(BatchAwaiterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call processBatch with correct parameters', async () => {
    const batchId = '12345';
    const webhookUrl = 'http://localhost:4000/webhook';

    await controller.handleBatch({ id: batchId, webhookUrl });  // Pass as an object

    expect(service.processBatch).toHaveBeenCalledWith(batchId, webhookUrl);
  });

  it('should throw an HttpException if processBatch fails', async () => {
    const batchId = '12345';
    const webhookUrl = 'http://localhost:4000/webhook';

    jest.spyOn(service, 'processBatch').mockRejectedValueOnce(new Error('Processing failed'));

    await expect(controller.handleBatch({ id: batchId, webhookUrl })).rejects.toThrow(
      new HttpException('An error occurred during processing', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
