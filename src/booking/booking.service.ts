import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBookingDto } from './dtos/CreateBooking.dto';
import { UpdateBookingDto } from './dtos/UpdateBooking.dto';

@Injectable()
export class BookingService 
{
    constructor(private prismaService:PrismaService){}

    async getBooking(){
        return await this.prismaService.datphong.findMany({})
    }


    async getDetailRoom(id: number) {
      return await this.prismaService.datphong.findFirst({
        where: { id: id }
      });
    }
 

    async getBookingByUser(id: number) {
      return await this.prismaService.datphong.findMany({
        where: { maNguoiDung: id }
      });
    }



    async createBooking(createBookingDto: CreateBookingDto) {
      // console.log('createBookingDto',createBookingDto)
        const checkUser = await this.prismaService.nguoidung.findFirst({
          where: {
            id: Number(createBookingDto.maNguoiDung),
          },
        });
      
        if (!checkUser) {
          throw new Error('User  does not exist ');
        }

        const checkRoom = await this.prismaService.phong.findFirst({
            where: {
              id: Number(createBookingDto.maPhong),
            },
          });
        
          if (!checkRoom) {
            throw new Error('Room does not exist ');
          }
      
        const newComment = await this.prismaService.datphong.create({
          data: {
            ...createBookingDto
           
          },
        });
      
        return newComment;
      }


      async updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
        // Chuyển đổi ID thành số nếu cần
        const bookingId = Number(id);
      
        // Kiểm tra sự tồn tại của người dùng
        const booking = await this.prismaService.datphong.findUnique({
          where: { id: bookingId }, // Sử dụng giá trị số
        });
      
        if (!booking) {
          throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
        }
      
        // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
        // const { id: _, ...updateData } = updateUserDto;
      
        // Cập nhật thông tin người dùng
        const updatedbooking = await this.prismaService.datphong.update({
          where: { id: bookingId }, // Sử dụng giá trị số
          data: updateBookingDto,
        });
      
        return updatedbooking;
      }


      async deleteBooking(id: number){
        const checkUser = await this.prismaService.datphong.findUnique({
             where:{
                id:id
             }
           });
         if(!checkUser){
             throw new HttpException({message:"Booking does not exist"}, HttpStatus.BAD_REQUEST)
         }
        
       const res = await this.prismaService.datphong.delete({
        where:{
            id:id
         }
       })
       return res
     }


   
    
}
