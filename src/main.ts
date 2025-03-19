import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Habilitar logs detallados en NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  // Add this to your bootstrap function after creating the app
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Lista de orígenes permitidos - CORREGIDO: quitado el slash final
  const allowedOrigins = [
    'https://welcometotegus.amdc.hn',
    'http://localhost:4200',
    'https://welcometotegus.netlify.app',
  ];

  // Configuración de CORS simplificada
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
    exposedHeaders: 'Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Crear un logger personalizado para depurar CORS
  const logger = new Logger('Bootstrap');
  logger.log(
    'Configuración de CORS aplicada con orígenes permitidos:',
    allowedOrigins,
  );

  // Middleware para loguear todas las solicitudes entrantes
  app.use((req, res, next) => {
    logger.debug(
      `Solicitud recibida: ${req.method} ${req.url} desde ${req.headers.origin}`,
    );
    next();
  });

  // Eliminado el middleware personalizado de CORS para evitar conflictos

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
  logger.log(`App Dev: http://localhost:${port}`);
  logger.log(`Documentación Dev Swagger: http://localhost/:${port}/api`);
}

bootstrap();
