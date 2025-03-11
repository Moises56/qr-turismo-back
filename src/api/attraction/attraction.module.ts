import { Module } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { AttractionController } from './attraction.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service'; // Para registrar acciones

@Module({
  imports: [PrismaModule],
  controllers: [AttractionController],
  providers: [AttractionService, PrismaService, LogsService],
})
export class AttractionModule {}
