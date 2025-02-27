import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
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

@Module({
  imports: [
    LugaresTuristicosModule,
    LocalesModule,
    TipoLocalModule,
    EventosModule,
    ImageItemModule,
    SuscribeModule,
    AttractionModule,
    RutasTuristicasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },],
})
export class AppModule {}
