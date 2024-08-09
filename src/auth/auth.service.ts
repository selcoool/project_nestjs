import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignUpDto } from './dtos/SignUp.dto';
import { hash } from 'bcrypt';
import { SignInDto } from './dtos/SignIn.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private prismaService:PrismaService,
        private jwtService:JwtService
    ){}

    async signUp(signUpDto: SignUpDto){
        const checkUser = await this.prismaService.nguoidung.findUnique({
             where:{
                 email:signUpDto.email
             }
           });
         if(checkUser){
             throw new HttpException({message:"This email has been used"}, HttpStatus.BAD_REQUEST)
         }
        const hashedPassword= await hash(signUpDto.pass_word, 10)
        
       const res = await this.prismaService.nguoidung.create({
         data: {...signUpDto, pass_word:hashedPassword}
       })
       return res
     }

     async signIn(signInDto: SignInDto){
        const checkUser = await this.prismaService.nguoidung.findUnique({
             where:{
                 email:signInDto.email
             }
           });
         if(!checkUser){
             throw new HttpException({message:"This account is not correct"}, HttpStatus.BAD_REQUEST)
         }


         const payload={id:checkUser.id,name:checkUser.name,email:checkUser.email}

         const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_KEY,
            expiresIn: '1h',
          });

          const freshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_KEY,
            expiresIn: '7d',
          });

          const {pass_word: _, ...user_Infor}=checkUser

          return {
            ...user_Infor,
            accessToken,
            freshToken
          }
    
     }
    

}
