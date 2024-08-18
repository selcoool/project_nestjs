import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/prisma.service';
import { GoogleDriveService } from 'src/upload.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService,PrismaService,GoogleDriveService]
})
export class RoomModule {}
