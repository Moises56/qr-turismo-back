import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventosService {
  constructor(private prisma: PrismaService) {}

  async create(createEventoDto: CreateEventoDto) {
    return this.prisma.evento.create({
      data: {
        ...createEventoDto,
        lugares: {
          create: createEventoDto.lugaresIds?.map((id) => ({
            lugarTuristico: { connect: { id } },
          })),
        },
      },
      include: { lugares: { include: { lugarTuristico: true } } },
    });
  }

  // Obtener todos los eventos
  async findAll() {
    return this.prisma.evento.findMany({
      include: { lugares: { include: { lugarTuristico: true } } },
    });
  }

  // Obtener un evento por ID
  async findOne(id: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { idEvento: id },
      include: { lugares: { include: { lugarTuristico: true } } },
    });
    if (!evento)
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    return evento;
  }

  // Actualizar un evento
  async update(id: string, updateEventoDto: UpdateEventoDto) {
    await this.findOne(id);
    return this.prisma.evento.update({
      where: { idEvento: id },
      data: {
        ...updateEventoDto,
        lugares: updateEventoDto.lugaresIds
          ? {
              set: updateEventoDto.lugaresIds.map((id) => ({
                id: id,
              })),
            }
          : undefined,
      },
      include: { lugares: { include: { lugarTuristico: true } } },
    });
  }

  // Eliminar un evento

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.evento.delete({ where: { idEvento: id } });
  }
}
