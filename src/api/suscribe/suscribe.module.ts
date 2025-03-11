import { Module } from '@nestjs/common';
import { SuscribeService } from './suscribe.service';
import { SuscribeController } from './suscribe.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { LogsService } from '../logs/logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [SuscribeController],
  providers: [SuscribeService, LogsService],
})
export class SuscribeModule {}
