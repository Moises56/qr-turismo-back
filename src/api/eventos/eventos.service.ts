import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventosService {
  constructor(private prisma: PrismaService) {}

  // Crear un evento con los lugares asociados
  async create(createEventoDto: CreateEventoDto) {
    // Asegúrate de que Prisma reciba el formato correcto
    const evento = await this.prisma.evento.create({
      data: {
        nombreEvento: createEventoDto.nombreEvento,
        descripcionEvento: createEventoDto.descripcionEvento,
        fechaEvento: createEventoDto.fechaEvento,
        tipoEvento: createEventoDto.tipoEvento,
        organizador: createEventoDto.organizador,
        invitados: createEventoDto.invitados,
        banerEvento: createEventoDto.banerEvento || '', // Valor por defecto si es opcional
        direccionEvento: createEventoDto.direccionEvento,
        lugares: {
          connect: createEventoDto.lugaresIds.map((id) => ({ id: id })),
        },
      },
    });

    return evento;
  }

  // Obtener todos los eventos
  async findAll() {
    return this.prisma.evento.findMany({
      include: {
        lugares: {
          include: {
            lugarTuristico: true, // Incluir los lugares turísticos relacionados
          },
        },
      },
    });
  }

  // Obtener un evento por ID
  async findOne(idEvento: string) {
    return this.prisma.evento.findUnique({
      where: { idEvento },
      include: {
        lugares: {
          include: {
            lugarTuristico: true, // Incluir los lugares turísticos relacionados
          },
        },
      },
    });
  }

  // Actualizar un evento
  async update(id: string, updateEventoDto: UpdateEventoDto) {
    const evento = await this.prisma.evento.update({
      where: { idEvento: id },
      data: {
        nombreEvento: updateEventoDto.nombreEvento,
        descripcionEvento: updateEventoDto.descripcionEvento,
        fechaEvento: updateEventoDto.fechaEvento,
        tipoEvento: updateEventoDto.tipoEvento,
        organizador: updateEventoDto.organizador,
        invitados: updateEventoDto.invitados,
        banerEvento: updateEventoDto.banerEvento,
        direccionEvento: updateEventoDto.direccionEvento,
        lugares: {
          connect: updateEventoDto.lugaresIds.map((id) => ({ id: id })),
        },
      },
    });
    return evento;
  }

  // Eliminar un evento
  async remove(idEvento: string) {
    return this.prisma.evento.delete({
      where: { idEvento },
    });
  }
}
