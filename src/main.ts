import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
