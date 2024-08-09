import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();


@Injectable()
export class GoogleDriveService {
    private drive: any;
  
    constructor() {
      this.initializeDrive();
    }
  
    private async initializeDrive() {
      const auth = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        null,
      //   (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n'),
        process.env.PRIVATE_KEY,
        ['https://www.googleapis.com/auth/drive']
      );
      await auth.authorize();
      this.drive = google.drive({ version: 'v3', auth });
    }
  
    public getDrive() {
      return this.drive;
    }
    

    



  }
