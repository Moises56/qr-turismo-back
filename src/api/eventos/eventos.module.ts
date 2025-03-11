import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { LogsService } from '../logs/logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventosController],
  providers: [EventosService, LogsService],
})
export class EventosModule {}
