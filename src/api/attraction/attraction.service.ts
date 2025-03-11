// src/attraction/attraction.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';

@Injectable()
export class AttractionService {
  constructor(private prisma: PrismaService) {}

  async create(createAttractionDto: CreateAttractionDto) {
    return this.prisma.attraction.create({
      data: createAttractionDto,
    });
  }

  async findAll() {
    return this.prisma.attraction.findMany({
      include: { lugar: true }, // Incluir relaciones si es necesario
    });
  }

  async findOne(id: string) {
    const attraction = await this.prisma.attraction.findUnique({
      where: { id },
      include: { lugar: true },
    });
    if (!attraction)
      throw new NotFoundException(`Atracción con ID ${id} no encontrada`);
    return attraction;
  }

  async update(id: string, updateAttractionDto: UpdateAttractionDto) {
    await this.findOne(id); // Verifica que exista antes de actualizar
    return this.prisma.attraction.update({
      where: { id },
      data: updateAttractionDto,
    });
  }

  async remove(id: string) {
    const attraction = await this.findOne(id); // Verifica que exista antes de eliminar
    await this.prisma.attraction.delete({
      where: { id },
    });
    return attraction;
  }
}
