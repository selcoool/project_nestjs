import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
  .setTitle('API airbnb')
  .setDescription('Task back-end last term')
  .setVersion('1.0')
  .addTag('Tran Minh Thanh')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/api', app, document);
  await app.listen(4500);
}
bootstrap();
