import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-email')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.emailService.sendEmail(to, subject, text);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}

