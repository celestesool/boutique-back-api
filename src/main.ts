import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CONFIGURAR CORS - Permitir peticiones desde el frontend
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://boutique-frontend-4l9w.vercel.app',
      /\.vercel\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma automáticamente los tipos
    }),
  );

  const port = parseInt(process.env.PORT) || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/graphql`);
}

bootstrap();
