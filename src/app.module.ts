import { Module, ValidationPipe } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


// import { GoogleDriveService } from './googleDriveConfig';

import { LocationModule } from './location/location.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { CommentModule } from './comment/comment.module';
import { WorksheetModule } from './worksheet/worksheet.module';


@Module({
  imports: [ AuthModule, UsersModule, LocationModule, RoomModule, BookingModule, CommentModule, WorksheetModule],
  controllers: [],
  providers: [
    {
       provide:APP_PIPE,
       useClass:ValidationPipe
  
    }
],
})
export class AppModule {}
