import { Test, TestingModule } from '@nestjs/testing';
import { WorksheetService } from './worksheet.service';

describe('WorksheetService', () => {
  let service: WorksheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorksheetService],
    }).compile();

    service = module.get<WorksheetService>(WorksheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
