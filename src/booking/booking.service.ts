import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookingService 
{
    constructor(private prismaService:PrismaService){}

    async getBooking(){
        return await this.prismaService.datphong.findMany({})
    }
    
}
