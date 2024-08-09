import { Module } from '@nestjs/common';
// import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { GoogleDriveService } from './upload.service';
// import { GoogleDriveService } from 'src/googleDriveConfig';

@Module({
  providers: [GoogleDriveService],
  controllers: [UploadController]
})
export class UploadModule {}
