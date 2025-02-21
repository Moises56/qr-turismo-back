import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    LugaresTuristicosModule,
    LocalesModule,
    TipoLocalModule,
    EventosModule,
    ImageItemModule,
    SuscribeModule,
    AttractionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
