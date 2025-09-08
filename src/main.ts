import { NestFactory } from '@nestjs/core';
import {AppModule} from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConflictExceptionFilter } from './Exception/email.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  const config = new DocumentBuilder()
    .setTitle('My Project API')              
    .setDescription('API documentation')   
    .setVersion('1.0')                      
    .build();


  const document = SwaggerModule.createDocument(app, config);


  SwaggerModule.setup('api', app, document);
 
  app.useGlobalFilters(new ConflictExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
