import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const allowedOrigins = [
    'https://welcometotegus.amdc.hn',
    'http://localhost:4200',
    'https://welcometotegus.netlify.app',
  ];

  const logger = new Logger('Bootstrap');

  // Middleware manual de CORS
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (!origin || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization,Accept',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Expose-Headers', 'Authorization');

      // Si es una solicitud OPTIONS, responder de inmediato
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
    } else {
      logger.warn(`Bloqueado por CORS: ${origin}`);
      return res
        .status(403)
        .json({ message: 'CORS policy does not allow this origin' });
    }

    next();
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3004;

  await app.listen(port);
  logger.log(`Aplicación corriendo en: http://localhost:${port}`);
}

bootstrap();
