import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';

// import { GoogleDriveService } from './googleDriveConfig';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ AuthModule, UsersModule, UploadModule, EmailModule],
  controllers: [AppController],
  providers: [AppService,
    {
       provide:APP_PIPE,
       useClass:ValidationPipe
  
    }
],
})
export class AppModule {}
