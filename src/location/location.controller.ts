import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { LocationService } from './location.service';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { CreateLocationDto, FilterLocationType } from './dtos/CreateLocation.dto';
import { UpdateLocationDto } from './dtos/UpdateLocation.dto';
import { UpdateImageLocation } from './dtos/UpdateImageLocation.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { GoogleDriveService } from 'src/upload/upload.service';
import { Readable } from 'stream';

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


@Controller('location')
export class LocationController {
    constructor(
      private readonly locationService: LocationService,
      private readonly googleDriveService: GoogleDriveService
    ) {}

    @Get()
    async getLocation(@Res() res: Response){
        try {
            const users = await this.locationService.getLocation();
            return res.status(HttpStatus.OK).json(successResponse("get",users,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }

    @Post()
    async createLocation(@Body() createLocationDto: CreateLocationDto, @Res() res: Response){
       
      try {
        const users = await this.locationService.createLocation(createLocationDto);
        return res.status(HttpStatus.OK).json(successResponse("post",users,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
      }
    }

    @Get('pagination_search')
    async pagination_search(@Query() filterLocationType:FilterLocationType, @Res() res: Response){
      try {

        // console.log('ssss',filterLocationType)
        const searchedItems = await this.locationService.pagination_search(filterLocationType);
        // console.log('sssssssss',deletedUser)
        return res.status(HttpStatus.OK).json(successResponse("get",searchedItems,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
      }
    }



    
    @Get(':id')
    async getDetailLocation(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const location = await this.locationService.getDetailLocation(id);
        // console.log('sssssss',users)
        if (!location) {
          return res.status(HttpStatus.NOT_FOUND).json(errorResponse("get", "Location not found", 'Error'));
        }
        return res.status(HttpStatus.OK).json(successResponse("get", location, 'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get", error.message, 'Error'));
      }
    }

    @Delete(':id')
    async deleteLocation(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
          // Đi ăn đói chết người
        // const drive = this.googleDriveService.getDrive();

        // const location = await this.locationService.getDetailLocation(id);
        //  console.log('sssssssssss',location)

        const deletedLocation = await this.locationService.deleteLocation(id);
        // console.log('sssssssss',deletedLocation)
        return res.status(HttpStatus.OK).json(successResponse("delete",deletedLocation,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
      }
    }

    @Put(':id')
    async updateLocation(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateLocationDto: UpdateLocationDto,
      @Res() res: Response
    ) {
         try {
        // console.log('hhhh',"sds")
        // Kiểm tra xem id có phải là số hợp lệ khôngđ
        if (isNaN(id) || id <= 0) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Invalid ID provided',
          });
        }
        const updatedUser = await this.locationService.updateLocation(id, updateLocationDto);
        return res.status(HttpStatus.OK).json(successResponse("put",updatedUser,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("put",error.message,'Error'));
      }
    }

    @Post('upload_image_location')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'anh_dai_dien', maxCount: 2 },
      { name: 'duong_dan', maxCount: 10 },
    ], {
      storage: memoryStorage,
      fileFilter: fileFilter,
    }))
    async uploadImageLocation(
      @UploadedFiles() files: { anh_dai_dien?: Express.Multer.File[], duong_dan?: Express.Multer.File[] },
      @Body() updateImageLocation: UpdateImageLocation,
      @Res() res: Response
    ) {
         try {
        const drive = this.googleDriveService.getDrive();

         const avatarFiles = files?.anh_dai_dien;
        // console.log('hhhh',drive)

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
            if (response.data.id) {
              const image_Google=`https://drive.google.com/thumbnail?id=${response.data.id}`;

              const updated_ImageLocation ={
                hinhAnh:image_Google,
                ...updateImageLocation

              }
 
              const updatedImageLocation = await this.locationService.updateImageLocation(updated_ImageLocation);
              return res.status(HttpStatus.OK).json(successResponse("post",updatedImageLocation,'Success'));
              //  console.log('op', updated_ImageLocation)
            }
            // console.log('Uploaded file ID:', response.data.id);
          }
        } 
        // Kiểm tra xem id có phải là số hợp lệ khôngđ
        
        // const updatedUser = await this.locationService.updateImageLocation(updateImageLocation);
        // return res.status(HttpStatus.OK).json(successResponse("post",updatedUser,'Success'));
        return res.status(HttpStatus.OK).json(successResponse("post","Have not attached Image",'Error'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
      }
    }


    


    




}
