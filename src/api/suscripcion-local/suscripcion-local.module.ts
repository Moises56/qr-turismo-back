import { Module } from '@nestjs/common';
import { SuscripcionLocalController } from './suscripcion-local.controller';
import { SuscripcionLocalService } from './suscripcion-local.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SuscripcionLocalController],
  providers: [SuscripcionLocalService],
  exports: [SuscripcionLocalService],
})
export class SuscripcionLocalModule {}
