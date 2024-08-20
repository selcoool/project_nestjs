import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CheckAuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext){
   
   
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.ACCESS_TOKEN_KEY
        }
      );

            if(payload){
              return true;
            }else{
              throw new HttpException(
                'Custom Error Message: You are not authorized to access this resource.', 
                HttpStatus.FORBIDDEN
              );
            }
      
    } catch {
      throw new UnauthorizedException();
      
    }
  
  }


   // const request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);
    // if (!token) {
    //   throw new UnauthorizedException();
    // }
    
  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }
}
