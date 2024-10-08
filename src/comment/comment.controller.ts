import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';
import { ApiTags } from '@nestjs/swagger';
import { CheckAuthGuard } from 'src/check-auth/check-auth.guard';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
    constructor(private  readonly commentService:CommentService){}

    @Get("get-comment-by-room/:maphong")
    async getCommentByRoom(
      @Param('maphong', ParseIntPipe) maphong: number,
        @Res() res: Response){
        try {
           
            
            // Uncomment and implement the following line to fetch comments based on the room ID
            const comments = await this.commentService.getCommentByRoom(maphong);
            
            // Return a successful response with the comments
            return res.status(HttpStatus.OK).json(successResponse("get", comments, 'Success'));
        } catch (error) {
            // Return an error response in case of failure
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get", error.message, 'Error'));
        }
    }

    @Get()
    // @UseGuards(CheckAuthGuard)
    async getRoom(@Res() res: Response){
        try {
            const rooms = await this.commentService.getComment();
            return res.status(HttpStatus.OK).json(successResponse("get",rooms,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }


    @Get(":manguoibinhluan/:maphong")
    // @UseGuards(CheckAuthGuard)
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
    // @UseGuards(CheckAuthGuard)
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
    // @UseGuards(CheckAuthGuard)
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


    @Put(':id')
    // @UseGuards(CheckAuthGuard)
    async updatelComment(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCommentDto: UpdateCommentDto,
      @Res() res: Response
    ) {
         try {
        // console.log('hhhh',"sds")
        // Kiểm tra xem id có phải là số hợp lệ khôngđ
        if (isNaN(id) || id <= 0) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Invalid ID provided',
          });
        }

        const {maPhong,maNguoiBinhLuan,saoBinhLuan,...commentDto}=updateCommentDto;
        const newComment={
            maPhong:Number(maPhong),
            maNguoiBinhLuan:Number(maNguoiBinhLuan),
            saoBinhLuan:Number(saoBinhLuan),
            ...commentDto
        }
      //  console.log('newComment',newComment)
        

        const updatedComment = await this.commentService.updateComment(id, newComment);
        return res.status(HttpStatus.OK).json(successResponse("put",updatedComment,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("put",error.message,'Error'));
      }
    }


    



}
