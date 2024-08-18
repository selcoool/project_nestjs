import { google, sheets_v4 } from 'googleapis';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GoogleDriveService {
  private drive: any;
  private sheets: sheets_v4.Sheets;

  constructor() {
    this.initializeGoogleApis();
  }

  private async initializeGoogleApis() {
    const auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.PRIVATE_KEY,
      [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets' // Add Sheets API scope
      ]
    );

    await auth.authorize();
    this.drive = google.drive({ version: 'v3', auth });
    this.sheets = google.sheets({ version: 'v4', auth });
  }

  public getDrive() {
    return this.drive;
  }

  public getSheets() {
    return this.sheets;
  }
}








