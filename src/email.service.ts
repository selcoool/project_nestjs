import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailTemplateRegister } from './templates/email-template-register';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_INFO, // Your Gmail address
        pass: process.env.PASSWORD_INFO, // Your app-specific password
      },
    });
  }

  // async sendEmail(to: string, subject: string, text: string) {
  //   const mailOptions = {
  //     from: 'trmthanhpro1@gmail.com', // Your Gmail address
  //     to: to,
  //     subject: subject,
  //     text: text,
  //   };
    async sendEmail(to: string, subject: string, text: string) {
      const companyName = "Welcome to Selcoool";
      const unsubscribeLink = "https://example.com/unsubscribe";
      const userName='testName';
      const verificationLink= 'https://youtube.com'
      const domain_name='youtu'
      let htmlr = emailTemplateRegister
        .replace('[USER_NAME]', userName)
        .replace('[VERIFICATION_LINK]', verificationLink)
        .replace('[DOMAIN_LINK]', domain_name)
        .replace('[COMPANY_NAME]', companyName)
        .replace('[EMAIL_SUBJECT]', 'Welcome to Our Service')
        .replace('[EMAIL_BODY]', 'Thank you for joining our service. We are thrilled to have you on board.')
        .replace('[UNSUBSCRIBE_LINK]', unsubscribeLink);


      const mailOptions = {
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: htmlr, // html body
      };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return { message: 'Email sent: ' + info.response };
    } catch (error) {
      console.error('Error sending email: ' + error.message);
      throw new Error('Failed to send email');
    }
  }
}

