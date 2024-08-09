import { Body, Controller, Delete, Get, HttpStatus, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Controller('users')
export class UsersController {
    
    constructor(private usersService:UsersService){}

    @Get()
    async getUser(@Res() res: Response){
        try {
            const users = await this.usersService.getUser();
            return res.status(HttpStatus.OK).json(successResponse("get",users,'Success'));
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
          }
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response){
       
      try {
        const users = await this.usersService.createUser(createUserDto);
        return res.status(HttpStatus.OK).json(successResponse("post",users,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
      }
    }
    
    @Put()
    async updateUser(
      @Body() updateUserDto: UpdateUserDto,
      @Res() res: Response
    ) {
      try {
        const { id, ...updateData } = updateUserDto;
        // Kiểm tra xem id có phải là số hợp lệ không
        if (isNaN(id) || id <= 0) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Invalid ID provided',
          });
        }
        const updatedUser = await this.usersService.updateUser(id, updateData);
        return res.status(HttpStatus.OK).json(successResponse("put",updatedUser,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
      }
    }



    @Delete()
    async deleteUser(
      @Query('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const deletedUser = await this.usersService.deleteUser(id);
        console.log('sssssssss',deletedUser)
        return res.status(HttpStatus.OK).json(successResponse("delete",deletedUser,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
      }
    }

}
