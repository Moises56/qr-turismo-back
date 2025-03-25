// Corrección para locales.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocalesService {
  constructor(private prisma: PrismaService) {}

  async create(createLocaleDto: CreateLocaleDto) {
    const { tipoLocalId, lugaresIds, ...restData } = createLocaleDto;

    // MongoDB with Prisma should handle the array directly
    // No need to stringify the horario field

    return this.prisma.local.create({
      data: {
        ...restData, // Include horario as-is
        tipoLocal: { connect: { id: tipoLocalId } },
        ...(lugaresIds && lugaresIds.length > 0
          ? {
              lugares: {
                create: lugaresIds.map((id) => ({
                  lugarTuristico: { connect: { id } },
                })),
              },
            }
          : {}),
      },
      include: {
        tipoLocal: true,
        lugares: { include: { lugarTuristico: true } },
      },
    });
  }

  async filterLocales(
    filters: {
      tipoLocalId?: string;
      nombre?: string;
      urlX?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const { tipoLocalId, nombre, urlX, page = 1, pageSize = 10 } = filters;

    const skip = (page - 1) * pageSize; // Calcular el offset

    // Definir el filtro where compatible con MongoDB
    const where: Prisma.LocalWhereInput = {
      ...(tipoLocalId ? { tipoLocalId } : {}),
      ...(nombre
        ? {
            nombre: {
              // Usar contains con mode: 'insensitive' para búsqueda case-insensitive
              contains: nombre,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(urlX ? { urlX } : {}),
    };

    // Obtener los locales paginados
    const locales = await this.prisma.local.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        tipoLocal: true,
        lugares: { include: { lugarTuristico: true } },
      },
    });

    // Contar el total de locales que coinciden con los filtros
    const total = await this.prisma.local.count({ where });

    return { locales, total };
  }

  async findAll() {
    return this.prisma.local.findMany({
      include: {
        tipoLocal: true,
        lugares: { include: { lugarTuristico: true } },
      },
    });
  }

  async findOne(id: string) {
    const local = await this.prisma.local.findUnique({
      where: { idLocal: id },
      include: {
        tipoLocal: true,
        lugares: { include: { lugarTuristico: true } },
      },
    });
    if (!local) throw new NotFoundException(`Local con ID ${id} no encontrado`);
    return local;
  }

  async update(id: string, updateLocaleDto: UpdateLocaleDto) {
    await this.findOne(id);

    const { tipoLocalId, lugaresIds, ...restData } = updateLocaleDto;

    // Para actualizar las relaciones con lugares, necesitamos un enfoque diferente
    const updateData: any = {
      ...restData,
      ...(tipoLocalId ? { tipoLocal: { connect: { id: tipoLocalId } } } : {}),
    };

    // Primero hacemos el update básico sin tocar las relaciones
    const updatedLocal = await this.prisma.local.update({
      where: { idLocal: id },
      data: updateData,
      include: {
        tipoLocal: true,
        lugares: { include: { lugarTuristico: true } },
      },
    });

    // Si hay lugaresIds, manejamos las relaciones por separado
    if (lugaresIds && lugaresIds.length > 0) {
      // Primero eliminamos todas las relaciones existentes
      await this.prisma.localRel.deleteMany({
        where: { localId: id },
      });

      // Luego creamos las nuevas relaciones
      for (const lugarId of lugaresIds) {
        await this.prisma.localRel.create({
          data: {
            lugarTuristico: { connect: { id: lugarId } },
            local: { connect: { idLocal: id } },
          },
        });
      }

      // Volvemos a obtener el local con las relaciones actualizadas
      return this.findOne(id);
    }

    return updatedLocal;
  }

  async remove(id: string) {
    await this.findOne(id);

    // Primero eliminamos las relaciones
    await this.prisma.localRel.deleteMany({
      where: { localId: id },
    });

    // Luego eliminamos el local
    return this.prisma.local.delete({ where: { idLocal: id } });
  }

  async findByTipoLocal(tipoLocalId: string) {
    return this.prisma.local.findMany({
      where: { tipoLocalId },
      include: {
        tipoLocal: true,
        lugares: { include: { lugarTuristico: true } },
      },
    });
  }
}
