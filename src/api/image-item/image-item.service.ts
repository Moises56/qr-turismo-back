// src/image-item/image-item.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateImageItemDto } from './dto/create-image-item.dto';
import { UpdateImageItemDto } from './dto/update-image-item.dto';

@Injectable()
export class ImageItemService {
  constructor(private prisma: PrismaService) {}

  async create(createImageItemDto: CreateImageItemDto) {
    return this.prisma.imageItem.create({
      data: createImageItemDto,
    });
  }

  async findAll() {
    return this.prisma.imageItem.findMany({ include: { lugar: true } });
  }

  async findOne(id: string) {
    const imageItem = await this.prisma.imageItem.findUnique({
      where: { id },
      include: { lugar: true },
    });
    if (!imageItem)
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    return imageItem;
  }

  async update(id: string, updateImageItemDto: UpdateImageItemDto) {
    await this.findOne(id);
    return this.prisma.imageItem.update({
      where: { id },
      data: updateImageItemDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.imageItem.delete({ where: { id } });
  }
}
