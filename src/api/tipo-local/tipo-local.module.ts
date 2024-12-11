import { Module } from '@nestjs/common';
import { TipoLocalService } from './tipo-local.service';
import { TipoLocalController } from './tipo-local.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TipoLocalController],
  providers: [TipoLocalService, PrismaService],
})
export class TipoLocalModule {}