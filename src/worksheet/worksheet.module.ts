import { Module } from '@nestjs/common';
import { WorksheetController } from './worksheet.controller';
import { WorksheetService } from './worksheet.service';
import { GoogleDriveService } from 'src/upload.service';

@Module({
  controllers: [WorksheetController],
  providers: [WorksheetService,GoogleDriveService]
})
export class WorksheetModule {}
