// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración explícita de CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'https://qr-turismo.amdc.hn'], // Orígenes permitidos como elementos separados
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const configService = app.get(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API Turismo')
    .setDescription('API para gestión de turismo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT') || 3004;
  await app.listen(port);
  console.log(`Aplicación corriendo en: http://localhost:${port}`);
  console.log(`Documentación Swagger: http://localhost:${port}/api`);
}

bootstrap();
