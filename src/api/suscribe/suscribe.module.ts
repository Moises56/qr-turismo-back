import { Module } from '@nestjs/common';
import { SuscribeService } from './suscribe.service';
import { SuscribeController } from './suscribe.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SuscribeController],
  providers: [SuscribeService],
})
export class SuscribeModule {}
