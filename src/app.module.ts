import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';

// import { GoogleDriveService } from './googleDriveConfig';
import { EmailModule } from './email/email.module';
import { LocationModule } from './location/location.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [ AuthModule, UsersModule, UploadModule, EmailModule, LocationModule, RoomModule, BookingModule, CommentModule],
  controllers: [AppController],
  providers: [AppService,
    {
       provide:APP_PIPE,
       useClass:ValidationPipe
  
    }
],
})
export class AppModule {}
