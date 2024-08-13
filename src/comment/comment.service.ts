import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';

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



}
