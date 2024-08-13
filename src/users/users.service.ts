import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, FilterUserType } from './dtos/CreateUser.dto';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Injectable()
export class UsersService {
    constructor(private prismaService:PrismaService){}

    async getUser(){
        return await this.prismaService.nguoidung.findMany({})
    }

    async getDetailUser(id:number){
      return await this.prismaService.nguoidung.findUnique({
        where: { id: id }, // Sử dụng giá trị số
      })
    }

    async createUser(createUserDto: CreateUserDto){
       const checkUser = await this.prismaService.nguoidung.findUnique({
            where:{
                email:createUserDto.email
            }
          });
        if(checkUser){
            throw new HttpException({message:"This email has been used"}, HttpStatus.BAD_REQUEST)
        }
       const hashedPassword= await hash(createUserDto.pass_word, 10)
       
      const res = await this.prismaService.nguoidung.create({
        data: {...createUserDto, pass_word:hashedPassword}
      })
      return res
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        // Chuyển đổi ID thành số nếu cần
        const userId = Number(id);
      
        // Kiểm tra sự tồn tại của người dùng
        const user = await this.prismaService.nguoidung.findUnique({
          where: { id: userId }, // Sử dụng giá trị số
        });
      
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      
        // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
        // const { id: _, ...updateData } = updateUserDto;
      
        // Cập nhật thông tin người dùng
        const updatedUser = await this.prismaService.nguoidung.update({
          where: { id: userId }, // Sử dụng giá trị số
          data: updateUserDto,
        });
      
        return updatedUser;
      }

      async deleteUser(id: number){
        const checkUser = await this.prismaService.nguoidung.findUnique({
             where:{
                id:id
             }
           });
         if(!checkUser){
             throw new HttpException({message:"Account does not exist"}, HttpStatus.BAD_REQUEST)
         }
        
       const res = await this.prismaService.nguoidung.delete({
        where:{
            id:id
         }
       })
       return res
     }

     async pagination_search(filterUserType: FilterUserType) {
      const items_per_page = Number(filterUserType.items_per_page) || Number(process.env.ITEMS_PER_PAGE);
      const page = Number(filterUserType.page) || 1;
      const search = filterUserType.search || '';
      const skip = page > 1 ? (page - 1) * items_per_page : 0;
    
      // Extract additional search parameters
      const { page: _, items_per_page: __, search: ___, ...searchParams } = filterUserType;
    
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
    
      const users = await this.prismaService.nguoidung.findMany({
        take: items_per_page,
        skip,
        where: dynamicSearchParams,
      });
    
      const total = await this.prismaService.nguoidung.count({
        where: dynamicSearchParams,
      });
    
      return {
        pagination_search: users,
        total,
        currentPage: page,
        items_per_page: items_per_page,
      };
    }


     async search_user(filterUserType:FilterUserType){
      const items_per_page=Number(filterUserType.items_per_page) || Number(process.env.ITEMS_PER_PAGE);
      const page =Number(filterUserType.page) || 1 ;
      const search = filterUserType.search || '' ;
      const skip=page > 1 ? (page -1) * items_per_page : 0 ;
      const users= await this.prismaService.nguoidung.findMany({
         take:items_per_page,
         skip,
         where:{
          AND: [
             {
              name:{
                contains:search
              }
             }
          ]
         }
      })

      const total = await this.prismaService.nguoidung.count({
        where: {
          AND: [
             {
              name:{
                contains:search
              }
             }
          ]
         }
      });
    
      return {
        pagination_search: users,
        total,
        currentPage: page,
        items_per_page: items_per_page,
      };
    }
 

 
}
