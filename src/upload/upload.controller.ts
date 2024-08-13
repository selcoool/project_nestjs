import { Controller, Post, UploadedFiles, UseInterceptors, Body, Res, HttpException, HttpStatus, Delete, Put } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { GoogleDriveService } from '../googleDriveConfig';
import { Readable } from 'stream';
import { Response } from 'express';
import * as multer from 'multer';
import { GoogleDriveService } from './upload.service';
import { DeleteUserDto } from './dtos/DeleteUser.dto';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { ApiTags } from '@nestjs/swagger';

const memoryStorage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedFormats = ['jpg', 'jpeg', 'png'];


  const fileFormat = file.originalname.split('.').pop().toLowerCase();
 
  if (allowedFormats.includes(fileFormat)) {
    cb(null, true);
  } else {
    // cb(new Error('Invalid file format: Only jpg, jpeg, and png are allowed.'), false);
    cb(new HttpException('Invalid file format: Only jpg, jpeg, and png are allowed.', HttpStatus.BAD_REQUEST), false);
  }
};



@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post('upload-files')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'anh_dai_dien', maxCount: 2 },
    { name: 'duong_dan', maxCount: 10 },
  ], {
    storage: memoryStorage,
    fileFilter: fileFilter,
  }))
  async uploadFiles(@UploadedFiles() files: { anh_dai_dien?: Express.Multer.File[], duong_dan?: Express.Multer.File[] }, @Body() body, @Res() res: Response) {
    try {
      const drive = this.googleDriveService.getDrive();

      const avatarFiles = files.anh_dai_dien;
      const otherFiles = files.duong_dan;

      if (avatarFiles && avatarFiles.length > 0) {
        for (const file of avatarFiles) {
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);

          const response = await drive.files.create({
            requestBody: {
              name: file.originalname,
              parents: ["1q_oPecVEnB4_7V1HHOegwzaVmTNmFVx_"]
            },
            media: {
              mimeType: file.mimetype,
              body: bufferStream,
            },
            fields: '*'
          });

          console.log('Uploaded file ID:', response.data.id);
        }
      } 

      if (otherFiles && otherFiles.length > 0) {
        for (const file of otherFiles) {
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);

          const response = await drive.files.create({
            requestBody: {
              name: file.originalname,
              parents: ["1q_oPecVEnB4_7V1HHOegwzaVmTNmFVx_"]
            },
            media: {
              mimeType: file.mimetype,
              body: bufferStream,
            },
            fields: '*'
          });

          console.log('Uploaded file ID:', response.data.id);
        }
      }

      return res.status(200).json({ message: "Files uploaded successfully" });
   
    } catch (error) {

     
      return res.status(400).json({ message: "Xảy ra lỗi nội bộ", error: error.message });
    }
  }


  @Delete('delete-files')
  async deleteFiles(@Body() deleteUserDto: DeleteUserDto, @Res() res: Response){
       
    try {



      const drive = this.googleDriveService.getDrive();

      const data_avatar = await drive.files.delete({ fileId: deleteUserDto.id});

      // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
      return res.status(HttpStatus.OK).json(successResponse("delete",data_avatar,'Success'));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
    }
  }


  @Put('update-files')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'anh_dai_dien', maxCount: 2 },
    { name: 'duong_dan', maxCount: 10 },
  ], {
    storage: memoryStorage,
    fileFilter: fileFilter,
  }))
  async updateFiles(@UploadedFiles() files: { anh_dai_dien?: Express.Multer.File[], duong_dan?: Express.Multer.File[] }, @Body() idImageDto: DeleteUserDto, @Res() res: Response){
       
    try {
      const drive = this.googleDriveService.getDrive();

      const avatarFiles = files.anh_dai_dien;
      const otherFiles = files.duong_dan;

      if (avatarFiles && avatarFiles.length > 0) {
        for (const file of avatarFiles) {
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);

          const response = await drive.files.create({
            requestBody: {
              name: file.originalname,
              parents: ["1q_oPecVEnB4_7V1HHOegwzaVmTNmFVx_"]
            },
            media: {
              mimeType: file.mimetype,
              body: bufferStream,
            },
            fields: '*'
          });

          await drive.files.delete({ fileId: idImageDto.id });

          return res.status(HttpStatus.OK).json(successResponse("delete","thanh còng",'Success'));
        }
      }
      
      

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
    }
  }




}







// import { Controller, Post, UploadedFiles, UseInterceptors, Body, Res } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { GoogleDriveService } from '../googleDriveConfig';
// import { Readable } from 'stream';
// import * as bcrypt from 'bcrypt';
// import { Response } from 'express';
// import * as multer from 'multer';

// const memoryStorage = multer.memoryStorage();

// const fileFilter = (req:any, file:any, cb:any) => {
//   const allowedFormats = ['jpg', 'jpeg', 'png', 'rar'];
//   const fileFormat = file.originalname.split('.').pop().toLowerCase();
//   if (allowedFormats.includes(fileFormat)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file format'));
//   }
// };

// @Controller('upload')
// export class UploadController {
//   constructor(private readonly googleDriveService: GoogleDriveService) {}

//   @Post()
//   @UseInterceptors(FilesInterceptor('files', 10, {
//     storage: memoryStorage,
//     fileFilter: fileFilter,
//   }))
//   async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Body() body, @Res() res: Response) {
//     try {
//       const drive = this.googleDriveService.getDrive();
//     //   const avartar = files.filter(file => file.fieldname === 'anh_dai_dien');
//       const avartar = files
//      console.log('ssssssss',files)
//       if (avartar && avartar.length > 0) {
//         for (const file of avartar) {
//           const bufferStream = new Readable();
//           bufferStream.push(file.buffer);
//           bufferStream.push(null);

//           const response = await drive.files.create({
//             requestBody: {
//               name: file.originalname,
//               parents: ["1q_oPecVEnB4_7V1HHOegwzaVmTNmFVx_"]
//             },
//             media: {
//               mimeType: file.mimetype,
//               body: bufferStream,
//             },
//             fields: '*'
//           });

      
//         }
//       } 
      
   
//     } catch (error) {
//       return res.status(400).json("loi");
//     }
//   }
// }

