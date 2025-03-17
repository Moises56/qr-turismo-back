// src/api/eventos/eventos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventosService {
  constructor(private prisma: PrismaService) {}

  async create(createEventoDto: CreateEventoDto) {
    // Validar si los lugaresIds existen antes de crear las relaciones
    if (createEventoDto.lugaresIds && createEventoDto.lugaresIds.length > 0) {
      for (const lugarId of createEventoDto.lugaresIds) {
        const lugarExists = await this.prisma.lugaresTuristicos.findUnique({
          where: { id: lugarId },
        });
        if (!lugarExists) {
          throw new NotFoundException(
            `LugarTuristico con ID ${lugarId} no encontrado`,
          );
        }
      }
    }

    // Create a copy of the DTO and remove lugaresIds
    const { lugaresIds, ...eventoData } = createEventoDto;

    return this.prisma.evento.create({
      data: {
        ...eventoData,
        lugares: {
          create:
            lugaresIds?.map((id) => ({
              lugarTuristico: { connect: { id } },
            })) || [],
        },
      },
      include: { lugares: { include: { lugarTuristico: true } } },
    });
  }

  // Obtener todos los eventos
  async findAll(nombre?: string, fecha?: string, tipo?: string) {
    const whereClause: any = {};

    if (nombre) {
      whereClause.nombreEvento = { contains: nombre, mode: 'insensitive' };
    }
    if (fecha) {
      whereClause.fechaEvento = new Date(fecha);
    }
    if (tipo) {
      whereClause.tipoEvento = { equals: tipo, mode: 'insensitive' };
    }

    return this.prisma.evento.findMany({
      where: whereClause,
      include: { lugares: { include: { lugarTuristico: true } } },
    });
  }

  // Obtener un evento por ID
  async findOne(id: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { idEvento: id },
      include: { lugares: { include: { lugarTuristico: true } } },
    });
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }
    return evento;
  }

  // Actualizar un evento
  async update(id: string, updateEventoDto: UpdateEventoDto) {
    await this.findOne(id);

    // If lugaresIds is provided, update relationships
    if (updateEventoDto.lugaresIds) {
      // Validate places exist
      for (const lugarId of updateEventoDto.lugaresIds) {
        const lugarExists = await this.prisma.lugaresTuristicos.findUnique({
          where: { id: lugarId },
        });
        if (!lugarExists) {
          throw new NotFoundException(
            `LugarTuristico con ID ${lugarId} no encontrado`,
          );
        }
      }

      // Delete existing relationships
      await this.prisma.eventoRel.deleteMany({
        where: { eventoId: id },
      });

      // Extract lugaresIds from the DTO
      const { lugaresIds, ...updateData } = updateEventoDto;

      // Create new relationships
      return this.prisma.evento.update({
        where: { idEvento: id },
        data: {
          ...updateData,
          lugares: {
            create: lugaresIds.map((lugarId) => ({
              lugarTuristico: { connect: { id: lugarId } },
            })),
          },
        },
        include: { lugares: { include: { lugarTuristico: true } } },
      });
    }

    // If lugaresIds is not provided, only update other fields
    return this.prisma.evento.update({
      where: { idEvento: id },
      data: updateEventoDto,
      include: { lugares: { include: { lugarTuristico: true } } },
    });
  }

  // Eliminar un evento
  async remove(id: string) {
    await this.findOne(id);

    // Eliminar primero las relaciones en EventoRel
    await this.prisma.eventoRel.deleteMany({
      where: { eventoId: id },
    });

    // Luego eliminar el evento
    return this.prisma.evento.delete({
      where: { idEvento: id },
    });
  }

  // Nuevo método para obtener los tipos de eventos únicos
  async getEventTypes(): Promise<string[]> {
    const eventos = await this.prisma.evento.findMany({
      select: {
        tipoEvento: true,
      },
      distinct: ['tipoEvento'], // Obtener valores únicos de tipoEvento
    });

    // Filtrar valores nulos y mapear a una lista de strings
    return eventos
      .map((evento) => evento.tipoEvento)
      .filter((tipo): tipo is string => tipo !== null && tipo !== undefined);
  }
}
