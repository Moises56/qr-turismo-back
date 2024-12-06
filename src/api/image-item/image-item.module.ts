import { Module } from '@nestjs/common';
import { ImageItemService } from './image-item.service';
import { ImageItemController } from './image-item.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Asegúrate de importar el PrismaModule
  controllers: [ImageItemController],
  providers: [ImageItemService],
})
export class ImageItemModule {}
