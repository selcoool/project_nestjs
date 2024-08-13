import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
@Controller('comment')
export class CommentController {
    constructor(private  readonly commentService:CommentService){}

    @Get()
    async getRoom(@Res() res: Response){
        try {
            const rooms = await this.commentService.getComment();
            return res.status(HttpStatus.OK).json(successResponse("get",rooms,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }


    @Get(":manguoibinhluan/:maphong")
    async getDetailRoom(
        @Param('manguoibinhluan', ParseIntPipe) manguoibinhluan: number,
        @Param('maphong', ParseIntPipe) maphong: number,
        @Res() res: Response){
        try {
            // console.log('manguoibinhluan',manguoibinhluan)
            // console.log('maphong',maphong)
            const comments = await this.commentService.getDetailComment(manguoibinhluan,maphong);
            return res.status(HttpStatus.OK).json(successResponse("get",comments,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }


    @Delete(":id")
    async deleteComment(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const deletedComment = await this.commentService.deleteComment(id);
        return res.status(HttpStatus.OK).json(successResponse("delete",deletedComment,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
      }
    }

    @Post()
    async createRoom(@Body() createCommentDto: CreateCommentDto,@Res() res: Response){
        try {

            const {maPhong,maNguoiBinhLuan,saoBinhLuan,...commentDto}=createCommentDto;
            const newComment={
                maPhong:Number(maPhong),
                maNguoiBinhLuan:Number(maNguoiBinhLuan),
                saoBinhLuan:Number(saoBinhLuan),
                ...commentDto
            }
      
            // console.log('ssss',khach)
            // console.log('newComment',newComment)
            const comment = await this.commentService.createComment(newComment);
            return res.status(HttpStatus.OK).json(successResponse("post",comment,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
          }
    }
}
