import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LugaresTuristicosModule } from './api/lugares-turisticos/lugares-turisticos.module';
import { LocalesModule } from './api/locales/locales.module';
import { TipoLocalModule } from './api/tipo-local/tipo-local.module';
import { EventosModule } from './api/eventos/eventos.module';
import { PrismaService } from './prisma/prisma.service';
import { ImageItemModule } from './api/image-item/image-item.module';

@Module({
  imports: [
    LugaresTuristicosModule,
    LocalesModule,
    TipoLocalModule,
    EventosModule,
    ImageItemModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
