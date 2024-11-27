import { Injectable } from '@nestjs/common';
import { CreateLugaresTuristicoDto } from './dto/create-lugares-turistico.dto';
import { UpdateLugaresTuristicoDto } from './dto/update-lugares-turistico.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LugaresTuristicosService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateLugaresTuristicoDto) {
    return this.prisma.lugaresTuristicos.create({
      data: {
        key: createDto.key,
        nombre: createDto.nombre,
        ubicacion: createDto.ubicacion,
        descripcion: createDto.descripcion,
        dias: createDto.dias,
        horarioEntrada: createDto.horarioEntrada,
        horarioSalida: createDto.horarioSalida,
        historia: createDto.historia,
        baner: createDto.baner,
      },
    });
  }

  async findAll() {
    return this.prisma.lugaresTuristicos.findMany({
      include: {
        locales: {
          include: {
            local: true,
          },
        },
        eventos: {
          include: {
            evento: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.lugaresTuristicos.findUnique({
      where: { id },
      include: {
        locales: {
          include: {
            local: true,
          },
        },
        eventos: {
          include: {
            evento: true,
          },
        },
      },
    });
  }

  async update(id: string, updateDto: UpdateLugaresTuristicoDto) {
    return this.prisma.lugaresTuristicos.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.lugaresTuristicos.delete({ where: { id } });
  }
}
