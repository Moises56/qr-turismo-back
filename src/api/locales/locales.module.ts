import { Module } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalesController } from './locales.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { LogsService } from '../logs/logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [LocalesController],
  providers: [LocalesService, LogsService],
})
export class LocalesModule {}
