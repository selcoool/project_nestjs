import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Injectable()
export class UsersService {
    constructor(private prismaService:PrismaService){}

    async getUser(){
        return await this.prismaService.nguoidung.findMany({})
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
        const { id: _, ...updateData } = updateUserDto;
      
        // Cập nhật thông tin người dùng
        const updatedUser = await this.prismaService.nguoidung.update({
          where: { id: userId }, // Sử dụng giá trị số
          data: updateData,
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
 

 
}
