import { Module } from '@nestjs/common';
import { LugaresTuristicosService } from './lugares-turisticos.service';
import { LugaresTuristicosController } from './lugares-turisticos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ImageItemService } from '../image-item/image-item.service';
import { ImageItemController } from '../image-item/image-item.controller';

@Module({
  imports: [PrismaModule], // Asegúrate de importar el PrismaModule
  controllers: [LugaresTuristicosController, ImageItemController],
  providers: [LugaresTuristicosService, ImageItemService],
})
export class LugaresTuristicosModule {}
