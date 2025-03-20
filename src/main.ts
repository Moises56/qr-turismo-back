import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '../all-exceptions.filter'; // Ajusta la ruta

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  app.enableCors({
    origin: [
      'https://welcometotegus.amdc.hn',
      'http://localhost:4200',
      'https://welcometotegus.netlify.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
    credentials: true,
    exposedHeaders: 'Authorization',
  });

  // Registra el filtro global
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3004;

  const logger = new Logger('Bootstrap');
  await app.listen(port);
  logger.log(`Aplicación corriendo en: http://localhost:${port}`);
}

bootstrap();
