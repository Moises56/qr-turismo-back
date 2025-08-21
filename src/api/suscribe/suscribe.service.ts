import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuscribeDto } from './dto/create-suscribe.dto';
import { UpdateSuscribeDto } from './dto/update-suscribe.dto';

@Injectable()
export class SuscribeService {
  constructor(private prisma: PrismaService) {}

  async create(createSuscribeDto: CreateSuscribeDto) {
    // Validar si el evento existe (si se proporciona un eventoId)
    let eventoIdToSave: string | undefined = undefined;
    if (
      createSuscribeDto.eventoId &&
      typeof createSuscribeDto.eventoId === 'string' &&
      createSuscribeDto.eventoId.trim() !== ''
    ) {
      // Validar formato de ObjectId (24 caracteres hexadecimales)
      if (/^[a-fA-F0-9]{24}$/.test(createSuscribeDto.eventoId)) {
        const eventoExists = await this.prisma.evento.findUnique({
          where: { idEvento: createSuscribeDto.eventoId },
        });
        if (!eventoExists) {
          throw new NotFoundException(
            `Evento con ID ${createSuscribeDto.eventoId} no encontrado`,
          );
        }
        eventoIdToSave = createSuscribeDto.eventoId;
      } else {
        // Si el formato no es válido, ignorar el eventoId
        eventoIdToSave = undefined;
      }
    }

    // Construir el objeto data sin eventoId si no es válido
    const dataToSave: any = { ...createSuscribeDto };
    // Eliminar eventoId si no es válido
    if (eventoIdToSave) {
      dataToSave.eventoId = eventoIdToSave;
    } else {
      delete dataToSave.eventoId;
    }
    dataToSave.eventDate = new Date(createSuscribeDto.eventDate);
    dataToSave.status = createSuscribeDto.status || 'pending';
    return this.prisma.suscripcion.create({
      data: dataToSave,
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
