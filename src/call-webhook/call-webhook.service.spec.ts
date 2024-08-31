import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CallWebhookService } from './call-webhook.service';
import { BatchEntity } from '../batch-awaiter/batch.entity';
import { Repository } from 'typeorm';

const mockBatchEntity = {
  id: 1,
  batchId: 'batch_123',
  webhookUrl: 'https://example.com/webhook',
  status: 'completed',
};

const mockBatchRepository = {
  find: jest.fn().mockResolvedValue([mockBatchEntity]),
  remove: jest.fn(),
};

// Mocking the fetch function globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
) as jest.Mock;

describe('CallWebhookService', () => {
  let service: CallWebhookService;
  let repository: Repository<BatchEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallWebhookService,
        {
          provide: getRepositoryToken(BatchEntity),
          useValue: mockBatchRepository,
        },
      ],
    }).compile();

    service = module.get<CallWebhookService>(CallWebhookService);
    repository = module.get<Repository<BatchEntity>>(getRepositoryToken(BatchEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should not remove the batch if the webhook call fails', async () => {
    console.log = jest.fn(); // Mock console.log to suppress output in test

    // Mock fetch to return a failed response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Server error'),
    });

    await service.processCompletedBatches();

    // Ensure the remove method was not called
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
