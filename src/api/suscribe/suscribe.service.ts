// src/suscribe/suscribe.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuscribeDto } from './dto/create-suscribe.dto';
import { UpdateSuscribeDto } from './dto/update-suscribe.dto';

@Injectable()
export class SuscribeService {
  constructor(private prisma: PrismaService) {}

  async create(createSuscribeDto: CreateSuscribeDto) {
    return this.prisma.suscripcion.create({
      data: {
        ...createSuscribeDto,
        eventDate: new Date(createSuscribeDto.eventDate),
      },
    });
  }

  async findAll() {
    return this.prisma.suscripcion.findMany();
  }

  async findOne(id: string) {
    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: { id },
    });
    if (!suscripcion)
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada`);
    return suscripcion;
  }

  async update(id: string, updateSuscribeDto: UpdateSuscribeDto) {
    await this.findOne(id);
    return this.prisma.suscripcion.update({
      where: { id },
      data: updateSuscribeDto.eventDate
        ? {
            ...updateSuscribeDto,
            eventDate: new Date(updateSuscribeDto.eventDate),
          }
        : updateSuscribeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.suscripcion.delete({ where: { id } });
  }
}
