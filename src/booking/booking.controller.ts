import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/CreateBooking.dto';
import { UpdateBookingDto } from './dtos/UpdateBooking.dto';


@ApiTags('booking')
@Controller('booking')
export class BookingController {
    constructor(private  readonly bookingService:BookingService){}

    @Get()
    async getRoom(@Res() res: Response){
        try {
            const bookings = await this.bookingService.getBooking();
            return res.status(HttpStatus.OK).json(successResponse("get",bookings,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));

          }
    }

    @Get('get-booking-user/:id')
    async getBookingByUser(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const location = await this.bookingService.getBookingByUser(id);
        // console.log('sssssss',users)
        if (!location) {
          return res.status(HttpStatus.NOT_FOUND).json(errorResponse("get", "Booking not found", 'Error'));
        }
        return res.status(HttpStatus.OK).json(successResponse("get", location, 'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get", error.message, 'Error'));
      }
    }

    @Post()
    async createRoom(@Body() createBookingDto: CreateBookingDto, @Res() res: Response) {
    try {
        // Ensure the ID is not set by the client
        const {maPhong,soLuongKhach,maNguoiDung,ngayDen,ngayDi}=createBookingDto;
            const newBooking={
                maPhong:Number(maPhong),
                soLuongKhach:Number(soLuongKhach),
                maNguoiDung:Number(maNguoiDung),
                ngayDen:new Date(ngayDen).toISOString(),
                ngayDi:new Date(ngayDi).toISOString(),
                
            }
        // console.log('newBooking',newBooking)
        const bookings = await this.bookingService.createBooking(newBooking);
        return res.status(HttpStatus.OK).json(successResponse("post", bookings, 'Success'));
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post", error.message, 'Error'));
    }
    }

    @Put(':id')
    async updateBooking(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateBookingDto: UpdateBookingDto,
      @Res() res: Response
    ) {
         try {
            // console.log("id",id)
            // console.log("updateBookingDto",updateBookingDto)
       
        if (isNaN(id) || id <= 0) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Invalid ID provided',
          });
        }
        const {maPhong,soLuongKhach,maNguoiDung,ngayDen,ngayDi}=updateBookingDto;
        const newBooking={
            maPhong:Number(maPhong),
            soLuongKhach:Number(soLuongKhach),
            maNguoiDung:Number(maNguoiDung),
            ngayDen:new Date(ngayDen).toISOString(),
            ngayDi:new Date(ngayDi).toISOString(),
            
        }

        const updatedBooking = await this.bookingService.updateBooking(id, newBooking);
        return res.status(HttpStatus.OK).json(successResponse("put",updatedBooking,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("put",error.message,'Error'));
      }
    }


    @Delete(':id')
    async deleteUser(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const deletedBooking = await this.bookingService.deleteBooking(id);
        return res.status(HttpStatus.OK).json(successResponse("delete",deletedBooking,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
      }
    }

    

}
