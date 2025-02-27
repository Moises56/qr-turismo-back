import { Module } from '@nestjs/common';
import { RutasTuristicasService } from './rutas-turisticas.service';
import { RutasTuristicasController } from './rutas-turisticas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RutasTuristicasController],
  providers: [RutasTuristicasService],
})
export class RutasTuristicasModule {}
