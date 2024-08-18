import { Test, TestingModule } from '@nestjs/testing';
import { WorksheetController } from './worksheet.controller';

describe('WorksheetController', () => {
  let controller: WorksheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorksheetController],
    }).compile();

    controller = module.get<WorksheetController>(WorksheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
