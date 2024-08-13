import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto, FilterRoomLocationType, FilterRoomType } from './dtos/CreateRoom.dto';
import { UpdateRoomDto } from './dtos/UpdateRoom.dto';
import { UpdateImageRoomDto } from './dtos/UpdateImageRoom.dto';

@Injectable()
export class RoomService {
    constructor(private prismaService:PrismaService){}

    async getRoom(){
        return await this.prismaService.phong.findMany({})
    }


    async getDetailRoom(id:number){
        return await this.prismaService.phong.findUnique({
          where: { id: id }, // Sử dụng giá trị số
        })
    }

    async createRoom(createRoomDto: CreateRoomDto) {
        const checkUser = await this.prismaService.nguoidung.findFirst({
          where: {
            id: createRoomDto.khach,
          },
        });
      
        if (!checkUser) {
          throw new Error('The user does not exist');
        }

        const checkLocation = await this.prismaService.vitri.findFirst({
            where: {
              id: createRoomDto.maViTri,
            },
          });
        
          if (!checkLocation) {
            throw new Error('The location does not exist');
          }
      
        const newRoom = await this.prismaService.phong.create({
          data: {
            ...createRoomDto
           
          },
        });
      
        return newRoom;
      }


      async search_room_location(filterRoomLocationType:FilterRoomLocationType){
        const items_per_page=Number(filterRoomLocationType.items_per_page) || Number(process.env.ITEMS_PER_PAGE)
        const page =Number(filterRoomLocationType.page) || 1
        const search = filterRoomLocationType.search || ''
        const skip=page > 1 ? (page -1) * items_per_page : 0
        const rooms= await this.prismaService.phong.findMany({
           take:items_per_page,
           skip,
           where:{
            AND: [
               {
                maViTri: {
                    equals: Number(search) // Chuyển `search` thành số nếu nó là chuỗi
                }
               }
            ]
           }
        })
  
        const total = await this.prismaService.phong.count({
          where: {
            AND: [
                {
                maViTri: {
                    equals: Number(search) // Chuyển `search` thành số nếu nó là chuỗi
                 }
                }
            ]
           }
        });
      
        return {
          search_room_location: rooms,
          total,
          currentPage: page,
          items_per_page: items_per_page,
        };
      }


      async pagination_search(filterRoomType: FilterRoomType) {
        const items_per_page = Number(filterRoomType.items_per_page) || Number(process.env.ITEMS_PER_PAGE);
        const page = Number(filterRoomType.page) || 1;
        const search = filterRoomType.search || '';
        const skip = page > 1 ? (page - 1) * items_per_page : 0;
      
        // Extract additional search parameters
        const { page: _, items_per_page: __, search: ___, ...searchParams } = filterRoomType;

       
      
        // Build the dynamic where clause
        const dynamicSearchParams = {
          AND: [
            {

                tenPhong:{
                    contains: search
                }
           
            }
          ],
        };
      
        const users = await this.prismaService.phong.findMany({
          take: items_per_page,
          skip,
          where: dynamicSearchParams,
        });
      
        const total = await this.prismaService.phong.count({
          where: dynamicSearchParams,
        });
      
        return {
          pagination_search: users,
          total,
          currentPage: page,
          items_per_page: items_per_page,
        };
      }


      async deleteRoom(id: number){
        const checkUser = await this.prismaService.phong.findUnique({
             where:{
                id:id
             }
           });
         if(!checkUser){
             throw new HttpException({message:"Room does not exist"}, HttpStatus.BAD_REQUEST)
         }
        
       const res = await this.prismaService.phong.delete({
        where:{
            id:id
         }
       })
       return res
     }

     async updateRoom(id: number, updateRoomDto: UpdateRoomDto) {
      // Chuyển đổi ID thành số nếu cần
      const roomId = Number(id);
    
      // Kiểm tra sự tồn tại của người dùng
      const room = await this.prismaService.phong.findUnique({
        where: { id: roomId }, // Sử dụng giá trị số
      });
    
      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
    
      // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
      // const { id: _, ...updateData } = updateUserDto;
    
      // Cập nhật thông tin người dùng
      const updatedUser = await this.prismaService.phong.update({
        where: { id: roomId }, // Sử dụng giá trị số
        data: updateRoomDto,
      });
    
      return updatedUser;
    }


    async updateImageRoom(updateImageRoom: UpdateImageRoomDto) {
      // Chuyển đổi ID thành số nếu cần

      const {id,...updatedImageRoomDto}=updateImageRoom
      const roomId = Number(id);

      // Kiểm tra sự tồn tại của người dùng
      const room = await this.prismaService.phong.findUnique({
        where: { id: roomId }, // Sử dụng giá trị số
      });
    
      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
    
      // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
      // const { id: _, ...updateData } = updateUserDto;
    
      // Cập nhật thông tin người dùng
      const updatedRoom = await this.prismaService.phong.update({
        where: { id: roomId }, // Sử dụng giá trị số
        data: updatedImageRoomDto,
      });
    
      return updatedRoom;
    }



      




}
