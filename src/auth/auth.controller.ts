import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { errorResponse, successResponse } from 'src/utils/response-data.util';
import { SignUpDto } from './dtos/SignUp.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInDto } from './dtos/SignIn.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response){
       
      try {
        const users = await this.authService.signUp(signUpDto);
        return res.status(HttpStatus.OK).json(successResponse("get",users,'Success'))
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
      }
    }

    @Post('signin')
    async signIn(@Body() signInDto: SignInDto, @Res() res: Response){
       
      try {
        const users = await this.authService.signIn(signInDto);
        if(users){
            res.cookie('access_token', users.accessToken, {
                path: '/',
                secure: true,
                // sameSite: 'strict',
                sameSite: 'none'
            })

            res.cookie('refresh_token', users.freshToken, {
                path: '/',
                secure: true,
                // sameSite: 'strict',
                sameSite: 'none'
            })

        }
        return res.status(HttpStatus.OK).json(successResponse("post",users,'Success'))
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse("post",error.message,'Error'));
      }
    }
}
