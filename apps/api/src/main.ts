import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.WEB_URL || 'http://localhost:3000',
    credentials: true
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  const port = process.env.API_PORT || 4000;
  await app.listen(port);

  console.log(`🚀 API server running on http://localhost:${port}`);
}

bootstrap();
