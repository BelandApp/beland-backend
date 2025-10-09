import { Test, TestingModule } from '@nestjs/testing';
import { EventPassService } from './event-pass.service';

describe('EventPassService', () => {
  let service: EventPassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventPassService],
    }).compile();

    service = module.get<EventPassService>(EventPassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
