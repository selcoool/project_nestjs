import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleDriveService } from 'src/upload.service';

@Controller('worksheet')
export class WorksheetController {
  constructor(private googleDriveService: GoogleDriveService) {}


  @Post('update_row')
  async updateRow(
    @Query('searchValue') searchValue: string, // Value to find
    @Body() updateData: { column: number; newValue: any }, // Data to update
    @Query('sheetName') sheetName: string,
    @Res() res: Response
  ) {
    try {
      const sheets = this.googleDriveService.getSheets();
      const spreadsheetId = '10mYzjqgnED6jFyTgsMqKB0vu1sdFLOXsONmG-vqwyAc';

      // Retrieve the spreadsheet metadata to get sheet names
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const sheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === sheetName);

      if (!sheet) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Sheet not found',
        });
      }

      const sheetId = sheet.properties.sheetId;
      const range = `${sheetName}!A1:E`; // Adjust range as needed

      // Get existing data
      const data = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      // Find the row with the specified search value
      const rows = data.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === searchValue); // Assuming searchValue is in the first column

      if (rowIndex === -1) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Value not found in the sheet',
        });
      }

      // Update the row
      const rangeToUpdate = `${sheetName}!A${rowIndex + 1}:E${rowIndex + 1}`; // Row indices are 1-based for Sheets API
      const updatedValues = rows[rowIndex];
      
      // Convert newValue to number if it should be a number
      const newValue = !isNaN(Number(updateData.newValue)) ? Number(updateData.newValue) : updateData.newValue;
      updatedValues[updateData.column] = newValue;

      const request = {
        spreadsheetId,
        range: rangeToUpdate,
        valueInputOption: 'RAW', // Ensure this is set to 'RAW' to preserve the format
        requestBody: {
          values: [updatedValues],
        },
      };

      await sheets.spreadsheets.values.update(request);

      return res.status(HttpStatus.OK).json({
        message: 'Row updated successfully',
      });
    } catch (error) {
      console.error('Error updating row:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating row',
        error: error.message,
      });
    }
  }

  @Delete('delete_row')
  async deleteRowByValue(
    @Query('sheetName') sheetName: string,
    @Query('value') value: string,
    @Res() res: Response,
  ) {
    try {
      // Get the Sheets API client
      const sheets = this.googleDriveService.getSheets();
      const spreadsheetId = '10mYzjqgnED6jFyTgsMqKB0vu1sdFLOXsONmG-vqwyAc'; // Replace with your spreadsheet ID

      // Fetch the spreadsheet metadata to get the sheet ID for the given sheet name
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const sheet = spreadsheet.data.sheets.find(s => s.properties.title === sheetName);
      if (!sheet) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Sheet with name ${sheetName} not found.`,
        });
      }

      const sheetId = sheet.properties.sheetId;

      // Fetch the data from the sheet to find the row with the specified value
      const range = `${sheetName}!A:Z`; // Adjust the range as needed
      const sheetData = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      
      const rows = sheetData.data.values;
      if (!rows || rows.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'No data found in the sheet.',
        });
      }

      

      // Find the row index containing the specified value
      const rowIndex = rows.findIndex(row => row.includes(value));
      if (rowIndex === -1) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Value ${value} not found in the sheet.`,
        });
      }


    

      // Construct the request body for deleting the row
      const request = {
        spreadsheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1,
                },
              },
            },
          ],
        },
      };

      // Execute the request to delete the row
      const response = await sheets.spreadsheets.batchUpdate(request);
      console.log('Row deleted successfully:', response.data);

      return res.status(HttpStatus.OK).json({
        message: 'Row deleted successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error deleting row:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting row',
        error: error.message,
      });
    }
  }


  @Get('read')
  async readSheet(@Res() res: Response) {
    try {
      const sheets = this.googleDriveService.getSheets();
      const spreadsheetId = '10mYzjqgnED6jFyTgsMqKB0vu1sdFLOXsONmG-vqwyAc';

      // Retrieve the spreadsheet metadata to get sheet names
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const sheetNames = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
      
      // Log sheet names to ensure we are accessing the correct sheet
      console.log('Sheet names:', sheetNames);

      // Use the first sheet name
      const firstSheetName = sheetNames[0];

      // Define the range to read data from the first sheet
      const range = `${firstSheetName}!A1:E`; // Adjust the range based on your data size

      // Read data from the sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      console.log('Data retrieved successfully:', response.data);

      return res.status(HttpStatus.OK).json({
        message: 'Data retrieved successfully',
        data: response.data.values, // The actual data is in `values`
      });

    } catch (error) {
      console.error('Error reading spreadsheet:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error reading spreadsheet',
        error: error.message,
      });
    }
  }

  @Post('write')
  async writeSheet(@Body() createDataDto: any, @Res() res: Response) {
    try {
      const sheets = this.googleDriveService.getSheets();
      const spreadsheetId = '10mYzjqgnED6jFyTgsMqKB0vu1sdFLOXsONmG-vqwyAc';

      // Retrieve the spreadsheet metadata to get sheet names
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const sheetNames = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
      
      // Log sheet names to ensure we are accessing the correct sheet
      console.log('Sheet names:', sheetNames);

      // Use the first sheet name
      const firstSheetName = sheetNames[0];

      // Define the range to write data to the first sheet
      const range = `${firstSheetName}!A1:E`; // Adjust the range based on your data size

    //   const Example = [
    //     {
    //       "id": 3,
    //       "tenViTri": "tenViTri 3",
    //       "tinhThanh": "Sa Pa",
    //       "quocGia": "Vietnam",
    //       "hinhAnh": "https://drive.google.com/thumbnail?id=1BbCCXO9JCuMzsUXTCCVM7aQVEwE_OvUK"
    //     },
    //     // Add more objects here...
    //   ];

        const Example=[
        {
            "id": 3,
            "tenViTri": "tenViTri 3",
            "tinhThanh": "Sa Pa",
            "quocGia": "Vietnam",
            "hinhAnh": "https://drive.google.com/thumbnail?id=1BbCCXO9JCuMzsUXTCCVM7aQVEwE_OvUK"
        },
        {
            "id": 4,
            "tenViTri": "Riverside updated",
            "tinhThanh": "tinhThanh",
            "quocGia": "quocGia",
            "hinhAnh": "https://drive.google.com/thumbnail?id=10L-QRjaj3WEPnDgWCndJg0gDtY_Kq99s"
        },
        {
            "id": 5,
            "tenViTri": "Old Quarter updated 1",
            "tinhThanh": "Hanoi  updated",
            "quocGia": "Vietnam updated",
            "hinhAnh": "https://drive.google.com/thumbnail?id=1dmuth6Kh_UREEbMfycLpxzXVwtFcQE0m"
        },
        {
            "id": 6,
            "tenViTri": "Countryside",
            "tinhThanh": "Mai Chau",
            "quocGia": "Vietnam",
            "hinhAnh": "countryside.jpg"
        },
        {
            "id": 7,
            "tenViTri": "Island Paradise",
            "tinhThanh": "Phu Quoc",
            "quocGia": "Vietnam",
            "hinhAnh": "island_paradise.jpg"
        },
        {
            "id": 8,
            "tenViTri": "Historic District",
            "tinhThanh": "Hue",
            "quocGia": "Vietnam",
            "hinhAnh": "historic_district.jpg"
        },
        {
            "id": 9,
            "tenViTri": "Beach Resort",
            "tinhThanh": "Nha Trang",
            "quocGia": "Vietnam",
            "hinhAnh": "beach_resort.jpg"
        },
        {
            "id": 10,
            "tenViTri": "Lakeside",
            "tinhThanh": "Da Lat",
            "quocGia": "Vietnam",
            "hinhAnh": "lakeside.jpg"
        }
    ]

      // Convert dataArray to rows of values
      const values = Example.map(item => [
        item.id,
        item.tenViTri,
        item.tinhThanh,
        item.quocGia,
        item.hinhAnh
      ]);

    //    console.log('values',values)
      // Prepare the request
      const request = {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values
        },
      };

    //   console.log('request',request)


      // Append the values in the sheet
      const response = await sheets.spreadsheets.values.append(request);
      console.log('Sheet updated successfully');

      return res.status(HttpStatus.OK).json({
        message: 'Sheet updated successfully',
        data: response.data,
      });

    } catch (error) {
      console.error('Error updating spreadsheet:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating spreadsheet',
        error: error.message,
      });
    }
  }

  






}

