import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';

@Injectable()
export class CommentService {
    constructor(private prismaService:PrismaService){}

    async getComment(){
        return await this.prismaService.binhluan.findMany({})
    }

    async getDetailComment(manguoibinhluan:number,maphong:number){

        const foundComment= await this.prismaService.binhluan.findFirst({
            where: {
               maNguoiBinhLuan: manguoibinhluan,
               maPhong:maphong

            },
          })
     
        if (!foundComment) {
        throw new Error('Comment is incorrect !');
        }

        // console.log('foundComment',foundComment)

        return foundComment;
    }


    async getCommentByRoom(maphong:number){

      const foundComment= await this.prismaService.binhluan.findFirst({
          where: {
             maPhong:maphong

          },
        })
   
      if (!foundComment) {
      throw new Error('Comment is incorrect !');
      }

      // console.log('foundComment',foundComment)

      return foundComment;
  }

    async createComment(createCommentDto: CreateCommentDto) {
        const checkUser = await this.prismaService.nguoidung.findFirst({
          where: {
            id: createCommentDto.maNguoiBinhLuan,
          },
        });
      
        if (!checkUser) {
          throw new Error('User  does not exist ');
        }

        const checkRoom = await this.prismaService.phong.findFirst({
            where: {
              id: createCommentDto.maPhong,
            },
          });
        
          if (!checkRoom) {
            throw new Error('Room does not exist ');
          }
      
        const newComment = await this.prismaService.binhluan.create({
          data: {
            ...createCommentDto
           
          },
        });
      
        return newComment;
      }

      async deleteComment(id: number){
        const checkCommemt = await this.prismaService.binhluan.findUnique({
             where:{
                id:id
             }
           });
         if(!checkCommemt){
             throw new HttpException({message:"Comment does not exist"}, HttpStatus.BAD_REQUEST)
         }

         const res = await this.prismaService.binhluan.delete({
            where:{
                id:id
             }
           })
       return res;
     }


     async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
      // Chuyển đổi ID thành số nếu cần
      const commentId = Number(id);
    
      // Kiểm tra sự tồn tại của người dùng
      const comment = await this.prismaService.binhluan.findUnique({
        where: { id: commentId }, // Sử dụng giá trị số
      });
    
      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }
    
      // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
      // const { id: _, ...updateData } = updateUserDto;
    
      // Cập nhật thông tin người dùng
      const updatedUser = await this.prismaService.binhluan.update({
        where: { id: commentId }, // Sử dụng giá trị số
        data: updateCommentDto,
      });
    
      return updatedUser;
    }



}
