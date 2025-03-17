import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
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

  // Lista de orígenes permitidos
  const allowedOrigins = [
    'http://localhost:4200',
    'https://qr-turismo.amdc.hn',
    'https://welcometotegus.netlify.app',
  ];

  // Configuración de CORS con validación dinámica de origen
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
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
  };

  app.enableCors(corsOptions);

  // Crear un logger personalizado para depurar CORS
  const logger = new Logger('Bootstrap');
  logger.log('Configuración de CORS aplicada:', corsOptions);

  // Middleware para loguear todas las solicitudes entrantes
  app.use((req, res, next) => {
    logger.debug(
      `Solicitud recibida: ${req.method} ${req.url} desde ${req.headers.origin}`,
    );
    next();
  });

  // Middleware personalizado para forzar encabezados CORS en todas las respuestas
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin); // Usar el origen específico
    } else {
      res.header('Access-Control-Allow-Origin', ''); // O vacío si no está permitido
    }
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,Accept',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Authorization');

    // Loguear los encabezados de respuesta para depuración
    res.on('finish', () => {
      logger.debug(`Respuesta enviada para ${req.method} ${req.url}:`, {
        status: res.statusCode,
        headers: res.getHeaders(),
      });
    });

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
