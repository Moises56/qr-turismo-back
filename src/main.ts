import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Lista de orígenes permitidos
  const allowedOrigins = [
    'https://welcometotegus.amdc.hn',
    'http://localhost:4200',
    'https://welcometotegus.netlify.app',
  ];

  // Configuración de CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Permitir el origen
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
    exposedHeaders: 'Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const logger = new Logger('Bootstrap');
  logger.log('Configuración de CORS aplicada:', { allowedOrigins });

  // Middleware para loguear solicitudes entrantes
  app.use((req, res, next) => {
    logger.debug(
      `Solicitud recibida: ${req.method} ${req.url} desde ${req.headers.origin}`,
    );
    next();
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
  logger.log(`Aplicación corriendo en: http://localhost:${port}`);
  logger.log(`Documentación Swagger: http://localhost:${port}/api`);
}

bootstrap();
