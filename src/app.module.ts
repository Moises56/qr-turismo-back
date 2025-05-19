// src/app.module.ts
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LugaresTuristicosModule } from './api/lugares-turisticos/lugares-turisticos.module';
import { LocalesModule } from './api/locales/locales.module';
import { TipoLocalModule } from './api/tipo-local/tipo-local.module';
import { EventosModule } from './api/eventos/eventos.module';
import { PrismaService } from './prisma/prisma.service';
import { ImageItemModule } from './api/image-item/image-item.module';
import { SuscribeModule } from './api/suscribe/suscribe.module';
import { AttractionModule } from './api/attraction/attraction.module';
import { RutasTuristicasModule } from './api/rutas-turisticas/rutas-turisticas.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { LogsModule } from './api/logs/logs.module';
import { SuscripcionLocalModule } from './api/suscripcion-local/suscripcion-local.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
      envFilePath: '.env', // Ruta al archivo .env
    }),
    LugaresTuristicosModule,
    LocalesModule,
    TipoLocalModule,
    EventosModule,
    ImageItemModule,
    SuscribeModule,
    AttractionModule,
    RutasTuristicasModule,
    AuthModule,
    UsersModule,
    LogsModule,
    SuscripcionLocalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
