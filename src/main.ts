import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //i am running it on port 8000
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
