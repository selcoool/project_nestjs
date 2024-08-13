import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLocationDto, FilterLocationType } from './dtos/CreateLocation.dto';
import { UpdateLocationDto } from './dtos/UpdateLocation.dto';
import { UpdateImageLocation } from './dtos/UpdateImageLocation.dto';

@Injectable()
export class LocationService {
    constructor(private prismaService:PrismaService){}

    async getLocation(){
        return await this.prismaService.vitri.findMany({})
    }

    async getDetailLocation(id:number){
      return await this.prismaService.vitri.findUnique({
        where: { id: id }, // Sử dụng giá trị số
      })
    }

    async createLocation(createLocationDto: CreateLocationDto) {
        const checkUser = await this.prismaService.vitri.findFirst({
          where: {
            tenViTri: createLocationDto.tenViTri,
          },
        });
      
        if (checkUser) {
          throw new Error('Location with this name already exists.');
        }
      
        const newLocation = await this.prismaService.vitri.create({
          data: {
            ...createLocationDto
           
          },
        });
      
        return newLocation;
      }


      async pagination_search(filterLocationType: FilterLocationType) {
        const items_per_page = Number(filterLocationType.items_per_page) || 5;
        const page = Number(filterLocationType.page) || 1;
        const search = filterLocationType.search || '';
        const skip = page > 1 ? (page - 1) * items_per_page : 0;
      
        // Extract additional search parameters
        const { page: _, items_per_page: __, search: ___, ...searchParams } = filterLocationType;
      
        // Build the dynamic where clause
        const dynamicSearchParams = {
          AND: [
            {
              // Spread additional search parameters
              ...Object.fromEntries(
                Object.entries(searchParams).map(([key, value]) => [
                  key,
                  { contains: value }, // Use contains dynamically for each searchParam without mode
                ])
              ),
            }
          ],
        };
      
        const users = await this.prismaService.vitri.findMany({
          take: items_per_page,
          skip,
          where: dynamicSearchParams,
        });
      
        const total = await this.prismaService.vitri.count({
          where: dynamicSearchParams,
        });
      
        return {
          pagination_search: users,
          total,
          currentPage: page,
          items_per_page: items_per_page,
        };
      }


      async updateLocation(id: number, updateLocationDto: UpdateLocationDto) {
        // Chuyển đổi ID thành số nếu cần
        const locationId = Number(id);
      
        // Kiểm tra sự tồn tại của người dùng
        const location = await this.prismaService.vitri.findUnique({
          where: { id: locationId }, // Sử dụng giá trị số
        });
      
        if (!location) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      
        // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
        // const { id: _, ...updateData } = updateUserDto;
      
        // Cập nhật thông tin người dùng
        const updatedLocation = await this.prismaService.vitri.update({
          where: { id: locationId }, // Sử dụng giá trị số
          data: updateLocationDto,
        });
      
        return updatedLocation;
      }

      async updateImageLocation(updateImageLocation: UpdateImageLocation) {
        // Chuyển đổi ID thành số nếu cần

        const {id,...updatedImageLocationDto}=updateImageLocation
        const locationId = Number(id);

        // Kiểm tra sự tồn tại của người dùng
        const location = await this.prismaService.vitri.findUnique({
          where: { id: locationId }, // Sử dụng giá trị số
        });
      
        if (!location) {
          throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
        }
      
        // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
        // const { id: _, ...updateData } = updateUserDto;
      
        // Cập nhật thông tin người dùng
        const updatedLocation = await this.prismaService.vitri.update({
          where: { id: locationId }, // Sử dụng giá trị số
          data: updatedImageLocationDto,
        });
      
        return updatedLocation;
      }


      async deleteLocation(id: number){
        const checkUser = await this.prismaService.vitri.findUnique({
             where:{
                id:id
             }
           });
         if(!checkUser){
             throw new HttpException({message:"Location does not exist"}, HttpStatus.BAD_REQUEST)
         }
        
       const res = await this.prismaService.vitri.delete({
        where:{
            id:id
         }
       })
       return res
     }
      
      
}
