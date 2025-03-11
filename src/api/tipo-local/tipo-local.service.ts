import { Injectable } from '@nestjs/common';
import { CreateTipoLocalDto } from './dto/create-tipo-local.dto';
import { UpdateTipoLocalDto } from './dto/update-tipo-local.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TipoLocalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTipoLocalDto: CreateTipoLocalDto) {
    return await this.prisma.tipoLocal.create({
      data: createTipoLocalDto,
    });
  }

  async findAll() {
    return await this.prisma.tipoLocal.findMany({
      include: { locales: true }, // Incluye la relación con Local
    });
  }

  async findOne(id: string) {
    return await this.prisma.tipoLocal.findUnique({
      where: { id },
      include: { locales: true }, // Incluye la relación con Local
    });
  }

  async update(id: string, updateTipoLocalDto: UpdateTipoLocalDto) {
    return await this.prisma.tipoLocal.update({
      where: { id },
      data: updateTipoLocalDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.tipoLocal.delete({
      where: { id },
    });
  }

  // get filter-by-description

  async filterByDescription(descripcion: string) {
    // console.log(descripcion);
    const searchTerm = descripcion.trim();

    try {
      return await this.prisma.tipoLocal.findMany({
        where: {
          descripcion: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        include: {
          locales: true,
        },
        orderBy: {
          descripcion: 'asc',
        },
      });
    } catch (error) {
      console.error('Error en filterByDescription:', error);
      return [];
    }
  }

  // async filterByDescription(descripcion: string) {
  //   console.log(descripcion);
  //   return await this.prisma.tipoLocal.findMany({
  //     where: {
  //       descripcion: {
  //         contains: descripcion,
  //         mode: 'insensitive', // Case-insensitive
  //       },
  //     },
  //     include: { locales: true }, // Incluye la relación con Local
  //   });
  // }

  // async filterByDescription(descripcion: string) {
  //   const regex = new RegExp(descripcion, 'i'); // 'i' para insensibilidad a mayúsculas/minúsculas
  //   return await this.prisma.$runCommandRaw({
  //     find: 'TipoLocal',
  //     filter: {
  //       descripcion: { $regex: regex.source },
  //     },
  //   });
  // }
}
