import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuscribeDto } from './dto/create-suscribe.dto';
import { UpdateSuscribeDto } from './dto/update-suscribe.dto';

@Injectable()
export class SuscribeService {
  constructor(private prisma: PrismaService) {}

  async create(createSuscribeDto: CreateSuscribeDto) {
    // Validar si el evento existe (si se proporciona un eventoId)
    if (createSuscribeDto.eventoId) {
      const eventoExists = await this.prisma.evento.findUnique({
        where: { idEvento: createSuscribeDto.eventoId },
      });
      if (!eventoExists) {
        throw new NotFoundException(
          `Evento con ID ${createSuscribeDto.eventoId} no encontrado`,
        );
      }
    }

    return this.prisma.suscripcion.create({
      data: {
        ...createSuscribeDto,
        eventDate: new Date(createSuscribeDto.eventDate),
        status: createSuscribeDto.status || 'pending', // Establecer estado por defecto
      },
      include: {
        evento: true, // Incluir el evento relacionado
      },
    });
  }

  async findAll() {
    return this.prisma.suscripcion.findMany({
      include: {
        evento: true, // Incluir el evento relacionado
      },
    });
  }

  async findOne(id: string) {
    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: { id },
      include: {
        evento: true, // Incluir el evento relacionado
      },
    });
    if (!suscripcion) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada`);
    }
    return suscripcion;
  }

  async update(id: string, updateSuscribeDto: UpdateSuscribeDto) {
    await this.findOne(id);

    // Validar si el evento existe (si se proporciona un eventoId)
    if (updateSuscribeDto.eventoId) {
      const eventoExists = await this.prisma.evento.findUnique({
        where: { idEvento: updateSuscribeDto.eventoId },
      });
      if (!eventoExists) {
        throw new NotFoundException(
          `Evento con ID ${updateSuscribeDto.eventoId} no encontrado`,
        );
      }
    }

    return this.prisma.suscripcion.update({
      where: { id },
      data: updateSuscribeDto.eventDate
        ? {
            ...updateSuscribeDto,
            eventDate: new Date(updateSuscribeDto.eventDate),
          }
        : updateSuscribeDto,
      include: {
        evento: true, // Incluir el evento relacionado
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.suscripcion.delete({ where: { id } });
  }
}
