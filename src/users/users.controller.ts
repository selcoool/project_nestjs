import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { CreateUserDto, FilterUserType } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CheckAuthGuard } from 'src/check-auth/check-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
    
    constructor(private usersService:UsersService){}
    
    @Get()
    // @ApiHeader({
    //   name: 'tokenMt',
    //   description: 'This is Tran Minh Thanh API',
    //   required: true,
    // })
    // @UseGuards(CheckAuthGuard)
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
        // console.log('createUserDto',createUserDto)
        const users = await this.usersService.createUser(createUserDto);
        return res.status(HttpStatus.OK).json(successResponse("post",users,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
      }
    }
    
    



    @Delete(':id')
    async deleteUser(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const deletedUser = await this.usersService.deleteUser(id);
        return res.status(HttpStatus.OK).json(successResponse("delete",deletedUser,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("delete",error.message,'Error'));
      }
    }

  


    @Get('pagination_search')
    async pagination_search(@Query() filterUserType:FilterUserType, @Res() res: Response){
      try {

        // console.log('ssss',filterUserType)
        const searchedItems = await this.usersService.pagination_search(filterUserType);
        // console.log('sssssssss',deletedUser)
        return res.status(HttpStatus.OK).json(successResponse("get",searchedItems,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
      }
    }


    @Get('search/:user_name')
    async search_user(@Param('user_name') user_name: string,@Query() filterUserType:FilterUserType, @Res() res: Response){
      try {
        const searchedItems = await this.usersService.search_user(user_name,filterUserType);
        return res.status(HttpStatus.OK).json(successResponse("get",searchedItems,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get",error.message,'Error'));
      }
    }


    @Get(':id')
    async getDetailUser(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ) {
      try {
        const users = await this.usersService.getDetailUser(id);
        // console.log('sssssss',users)
        if (!users) {
          return res.status(HttpStatus.NOT_FOUND).json(errorResponse("get", "User not found", 'Error'));
        }
        return res.status(HttpStatus.OK).json(successResponse("get", users, 'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("get", error.message, 'Error'));
      }
    }



    @Put(':id')
    async updatelUser(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
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
        const updatedUser = await this.usersService.updateUser(id, updateUserDto);
        return res.status(HttpStatus.OK).json(successResponse("put",updatedUser,'Success'));
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("put",error.message,'Error'));
      }
    }
   

    

}
