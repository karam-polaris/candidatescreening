import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      /\.vercel\.app$/,  // Allow all Vercel domains
      /\.onrender\.com$/,  // Allow all Render domains
      process.env.WEB_URL || 'http://localhost:3000'
    ],
    credentials: true
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  const port = process.env.PORT || process.env.API_PORT || 4000;
  await app.listen(port);

  console.log(`🚀 API server running on port ${port}`);
}

bootstrap();
