import { Module } from '@nestjs/common';
import { LugaresTuristicosService } from './lugares-turisticos.service';
import { LugaresTuristicosController } from './lugares-turisticos.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Asegúrate de importar el PrismaModule
  controllers: [LugaresTuristicosController],
  providers: [LugaresTuristicosService],
})
export class LugaresTuristicosModule {}
