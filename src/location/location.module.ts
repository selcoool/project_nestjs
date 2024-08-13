import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { PrismaService } from 'src/prisma.service';
import { GoogleDriveService } from 'src/upload/upload.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService,PrismaService,GoogleDriveService]
})
export class LocationModule {}
