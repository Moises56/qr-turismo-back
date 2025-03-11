// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilitar cors
  app.enableCors();

  // Obtén el ConfigService para leer variables de entorno
  const configService = app.get(ConfigService);

  // Configura filtros globales
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Turismo')
    .setDescription('API para gestión de turismo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Usa el puerto desde las variables de entorno o 3000 por defecto
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Aplicación corriendo en: http://localhost:${port}`);
  console.log(`Documentación Swagger: http://localhost:${port}/api`);
}

bootstrap();
