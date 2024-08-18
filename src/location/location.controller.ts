import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { LocationService } from './location.service';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { CreateLocationDto, FilterLocationType } from './dtos/CreateLocation.dto';
import { UpdateLocationDto } from './dtos/UpdateLocation.dto';
import { UpdateImageLocation } from './dtos/UpdateImageLocation.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { GoogleDriveService } from 'src/upload.service';
import { Readable } from 'stream';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CheckAuthGuard } from 'src/check-auth/check-auth.guard';

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



@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly googleDriveService: GoogleDriveService
  ) { }

  @Get()
  async getLocation(@Res() res: Response) {
    try {
      const users = await this.locationService.getLocation();
      return res.status(HttpStatus.OK).json(successResponse("get", users, 'Success'));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get", error.message, 'Error'));
    }
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'hinhAnh', maxCount: 1 },
    // { name: 'duong_dan', maxCount: 2 },
  ], {
    storage: memoryStorage,
    fileFilter: fileFilter,
  }))
  async createLocation(
    @UploadedFiles() files: { hinhAnh?: Express.Multer.File[] },
    @Body() createLocationDto: CreateLocationDto,
    @Res() res: Response
  ) {
    try {

      const drive = this.googleDriveService.getDrive();

      const avatarFiles = files?.hinhAnh;

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
            const image_Google = `https://drive.google.com/thumbnail?id=${response.data.id}`;
            delete createLocationDto.hinhAnh
            const { ...RoomDto } = createLocationDto;
            const new_ImageRoom = {
              hinhAnh: image_Google,
              ...RoomDto
            };


            // console.log('anh',new_ImageRoom )

            const rooms = await this.locationService.createLocation(new_ImageRoom);
            await this.locationService.writeSheet(rooms)
            return res.status(HttpStatus.OK).json(successResponse("post", rooms, 'Success'));

          }

        }
      } else {
        // xoa gia tri thuoc tinh hinhAnh trong createLocationDto neu co
        delete createLocationDto.hinhAnh
        const { ...RoomDto } = createLocationDto;
        const newRoom = {
          hinhAnh: "https://drive.google.com/thumbnail?id=1EZjKa05nQfacqb9EjEGr_q6BM5tJz6gU",
          ...RoomDto
        };

        const rooms = await this.locationService.createLocation(newRoom);
        await this.locationService.writeSheet(rooms)
        return res.status(HttpStatus.OK).json(successResponse("post", rooms, 'Success'));

      }


    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post", error.message, 'Error'));
    }
  }

  @Get('pagination_search')
  async pagination_search(@Query() filterLocationType: FilterLocationType, @Res() res: Response) {
    try {

      // console.log('ssss',filterLocationType)
      const searchedItems = await this.locationService.pagination_search(filterLocationType);
      // console.log('sssssssss',deletedUser)
      return res.status(HttpStatus.OK).json(successResponse("get", searchedItems, 'Success'));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get", error.message, 'Error'));
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
      const deletedLocation = await this.locationService.deleteLocation(id);
      // console.log('sssssssss',deletedLocation)
      return res.status(HttpStatus.OK).json(successResponse("delete", deletedLocation, 'Success'));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete", error.message, 'Error'));
    }
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'hinhAnh', maxCount: 1 },
    // { name: 'duong_dan', maxCount: 10 },
  ], {
    storage: memoryStorage,
    fileFilter: fileFilter,
  }))
  async updateLocation(
    @UploadedFiles() files: {
      hinhAnh?: Express.Multer.File[]
      // , duong_dan?: Express.Multer.File[] 
    },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
    @Res() res: Response
  ) {
    try {
      // console.log('hidhhh',id)
      // console.log('updateLocationDto',updateLocationDto)
      // Kiểm tra xem id có phải là số hợp lệ khôngđ
      // if (isNaN(id) || id <= 0) {
      //   return res.status(HttpStatus.BAD_REQUEST).json({
      //     message: 'Invalid ID provided',
      //   });
      // }

      const drive = this.googleDriveService.getDrive();

      const avatarFiles = files.hinhAnh;

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
            const image_Google = `https://drive.google.com/thumbnail?id=${response.data.id}`;
            delete updateLocationDto.hinhAnh
            const {...RoomDto } = updateLocationDto;
            const new_ImageRoom = {
              hinhAnh: image_Google,
              ...RoomDto
            };


            // console.log('anh',new_ImageRoom )

            const updatedRoom = await this.locationService.updateLocationWithImage(id, new_ImageRoom);
            return res.status(HttpStatus.OK).json(successResponse("post", updatedRoom, 'Success'));

          }

        }

      }else {

        delete updateLocationDto.hinhAnh
        const {...RoomDto } = updateLocationDto;
        const new_ImageRoom = {
          ...RoomDto
        };

        const updatedRoom = await this.locationService.updateLocationWithoutImage(id, new_ImageRoom);
        return res.status(HttpStatus.OK).json(successResponse("post", updatedRoom, 'Success'));

      }




      // const updatedUser = await this.locationService.updateLocation(id, updateLocationDto);
      // return res.status(HttpStatus.OK).json(successResponse("put", updatedUser, 'Success'));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("put", error.message, 'Error'));
    }
  }

  @Post('upload_image_location')
  // @ApiHeader({
  //   name: 'tokenCybersoft',
  //   description: 'Custom token for CyberSoft API',
  //   required: true,
  // })
  // @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'hinhAnh', maxCount: 1 },
    // { name: 'duong_dan', maxCount: 10 },
  ], {
    storage: memoryStorage,
    fileFilter: fileFilter,
  }))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       anh_dai_dien: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //       duong_dan: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //       // Add properties of `UpdateImageLocation` here
  //       // Example:
  //       locationId: { type: 'string', description: 'Location ID' },
  //       description: { type: 'string', description: 'Description of the location' },
  //       // Add other properties of the `UpdateImageLocation` DTO
  //     },
  //   },
  // })
  async uploadImageLocation(
    @UploadedFiles() files: {
      hinhAnh?: Express.Multer.File[]
      // , duong_dan?: Express.Multer.File[] 
    },
    @Body() updateImageLocation: UpdateImageLocation,
    @Res() res: Response
  ) {
    try {
      const drive = this.googleDriveService.getDrive();

      const avatarFiles = files?.hinhAnh;
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
            const image_Google = `https://drive.google.com/thumbnail?id=${response.data.id}`;

            const updated_ImageLocation = {
              hinhAnh: image_Google,
              ...updateImageLocation

            }

            const updatedImageLocation = await this.locationService.updateImageLocation(updated_ImageLocation);
            return res.status(HttpStatus.OK).json(successResponse("post", updatedImageLocation, 'Success'));

          }

        }
      }


      return res.status(HttpStatus.OK).json(successResponse("post", "Have not attached Image", 'Error'));
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post", error.message, 'Error'));
    }
  }










}
