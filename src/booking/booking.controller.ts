import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { BookingService } from './booking.service';


@ApiTags('comment')
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
}
