import { Injectable } from '@nestjs/common';

import { CreateImageItemDto } from './dto/create-image-item.dto';
import { UpdateImageItemDto } from './dto/update-image-item.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImageItemService {
  constructor(private prisma: PrismaService) {}

  async create(createImageItemDto: CreateImageItemDto) {
    const imageItem = await this.prisma.imageItem.create({
      data: {
        url: createImageItemDto.url,
        name: createImageItemDto.name,
        description: createImageItemDto.description,
        lugarId: createImageItemDto.lugarId, // Asociar la imagen con un lugar turístico
      },
    });

    return imageItem;
  }

  async findAll() {
    return this.prisma.imageItem.findMany();
  }

  async findOne(id: string) {
    return this.prisma.imageItem.findUnique({
      where: { id },
      include: { lugar: true }, // Incluir el lugar relacionado
    });
  }

  //update
  async update(id: string, updateImageItemDto: UpdateImageItemDto) {
    return this.prisma.imageItem.update({
      where: { id },
      data: {
        url: updateImageItemDto.url,
        name: updateImageItemDto.name,
        description: updateImageItemDto.description,
        lugarId: updateImageItemDto.lugarId, // Actualizar la relación con el lugar turístico
      },
    });
  }

  async remove(id: string) {
    return this.prisma.imageItem.delete({ where: { id } });
  }
}
