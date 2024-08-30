import { Test, TestingModule } from '@nestjs/testing';
import { BatchAwaiterService } from './batch-awaiter.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BatchEntity } from './batch.entity';

describe('BatchAwaiterService', () => {
  let service: BatchAwaiterService;
  let repository: Repository<BatchEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchAwaiterService,
        {
          provide: getRepositoryToken(BatchEntity),
          useClass: Repository, // Mock Repository
        },
      ],
    }).compile();

    service = module.get<BatchAwaiterService>(BatchAwaiterService);
    repository = module.get<Repository<BatchEntity>>(getRepositoryToken(BatchEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save batch data to the database', async () => {
    const batchId = '12345';
    const webhookUrl = 'http://localhost:4000/webhook';

    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce({
      id: 1,
      batchId: batchId,
      webhookUrl: webhookUrl,
    } as BatchEntity);

    await service.processBatch(batchId, webhookUrl);

    expect(saveSpy).toHaveBeenCalledWith({
      batchId: batchId,
      webhookUrl: webhookUrl,
    });
  });

  it('should throw an error if batchId or webhookUrl is missing', async () => {
    await expect(service.processBatch('', 'http://localhost:4000/webhook')).rejects.toThrow(
      'Missing required fields: batchId and webhookUrl',
    );

    await expect(service.processBatch('12345', '')).rejects.toThrow(
      'Missing required fields: batchId and webhookUrl',
    );
  });
});
