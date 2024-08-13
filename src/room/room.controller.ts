import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { RoomService } from './room.service';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { Response } from 'express';
import { CreateRoomDto, FilterRoomLocationType, FilterRoomType } from './dtos/CreateRoom.dto';
import { UpdateRoomDto } from './dtos/UpdateRoom.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { GoogleDriveService } from 'src/upload/upload.service';
import { Readable } from 'stream';
import { UpdateImageRoomDto } from './dtos/UpdateImageRoom.dto';

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


@Controller('room')
export class RoomController {
    constructor(
      private  readonly roomService:RoomService,
      private readonly googleDriveService: GoogleDriveService
    ){}
    @Get()
    async getRoom(@Res() res: Response){
        try {
            const rooms = await this.roomService.getRoom();
            return res.status(HttpStatus.OK).json(successResponse("get",rooms,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }

    @Get(':id')
    async getDetailRoom(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const rooms = await this.roomService.getDetailRoom(id);
        // console.log('sssssss',users)
        if (!rooms) {
          return res.status(HttpStatus.NOT_FOUND).json(errorResponse("get", "Room not found", 'Error'));
        }
        return res.status(HttpStatus.OK).json(successResponse("get", rooms, 'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get", error.message, 'Error'));
      }
    }


    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto,@Res() res: Response){
        try {

            const {khach,phongTam,phongNgu,giuong,giaTien,maViTri,...RoomDto}=createRoomDto;
            const newRoom ={
                khach:Number(khach),
                phongTam:Number(phongTam),
                phongNgu:Number(phongNgu),
                giuong:Number(giuong),
                giaTien:Number(giaTien),
                maViTri:Number(maViTri),
                ...RoomDto
            }
      
            // console.log('ssss',khach)
            // console.log('RoomDto',newRoom)
            const rooms = await this.roomService.createRoom(newRoom);
            return res.status(HttpStatus.OK).json(successResponse("post",rooms,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }

    @Get('get_room_location')
    async search_user(@Query() filterRoomLocationType:FilterRoomLocationType, @Res() res: Response){
        try {
            const rooms = await this.roomService.search_room_location(filterRoomLocationType);
            return res.status(HttpStatus.OK).json(successResponse("get",rooms,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }

    @Get('pagination_search')
    async pagination_search(@Query() filterRoomType:FilterRoomType, @Res() res: Response){
      try {


        // const {khach,phongTam,phongNgu,giuong,giaTien,maViTri,...RoomDto}=filterRoomType;
        //     const newRoom ={
        //         khach:Number(khach),
        //         phongTam:Number(phongTam),
        //         phongNgu:Number(phongNgu),
        //         giuong:Number(giuong),
        //         giaTien:Number(giaTien),
        //         maViTri:Number(maViTri),
        //         ...RoomDto
        //     }
        // console.log('filterRoomType',filterRoomType)
        const searchedItems = await this.roomService.pagination_search(filterRoomType);
        // console.log('sssssssss',deletedUser)
        return res.status(HttpStatus.OK).json(successResponse("get",searchedItems,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
      }
    }


    @Delete(':id')
    async deleteRoom(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const deletedRoom = await this.roomService.deleteRoom(id);
        return res.status(HttpStatus.OK).json(successResponse("delete",deletedRoom,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
      }
    }


    @Put(':id')
    async updatelRoom(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateRoomDto: UpdateRoomDto,
      @Res() res: Response
    ) {
         try {
        

        delete updateRoomDto.khach
        delete updateRoomDto.maViTri
  
       
        // Kiểm tra xem id có phải là số hợp lệ khôngđ
        if (isNaN(id) || id <= 0) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Invalid ID provided',
          });
        }
        const updatedRoom = await this.roomService.updateRoom(id, updateRoomDto);
        return res.status(HttpStatus.OK).json(successResponse("put",updatedRoom,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("put",error.message,'Error'));
      }
    }


    @Post('upload_image_room')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'anh_dai_dien', maxCount: 2 },
      { name: 'duong_dan', maxCount: 2 },
    ], {
      storage: memoryStorage,
      fileFilter: fileFilter,
    }))
    async uploadImageRoom(
      @UploadedFiles() files: { anh_dai_dien?: Express.Multer.File[], duong_dan?: Express.Multer.File[] },
      @Body() updateImageRoom: UpdateImageRoomDto,
      @Res() res: Response
    ) {
         try {
        const drive = this.googleDriveService.getDrive();

         const avatarFiles = files?.anh_dai_dien;
        //  console.log('avatarFiles',avatarFiles)
        // // console.log('hhhh',drive)

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

              const updated_ImageRoom ={
                hinhAnh:image_Google,
                ...updateImageRoom

              }

              // console.log('anh',updated_ImageRoom )
 
              const updatedImageRoom = await this.roomService.updateImageRoom(updated_ImageRoom);
              return res.status(HttpStatus.OK).json(successResponse("post",updatedImageRoom,'Success'));
          
            }
       
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
