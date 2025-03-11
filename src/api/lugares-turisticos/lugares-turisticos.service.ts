// src/api/lugares-turisticos/lugares-turisticos.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLugaresTuristicoDto } from './dto/create-lugares-turistico.dto';
import { UpdateLugaresTuristicoDto } from './dto/update-lugares-turistico.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class LugaresTuristicosService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateLugaresTuristicoDto) {
    const lugar = await this.prisma.lugaresTuristicos.create({
      data: {
        key: createDto.key,
        nombre: createDto.nombre,
        ubicacion: createDto.ubicacion,
        latitud: createDto.latitud,
        longitud: createDto.longitud,
        descripcion: createDto.descripcion,
        dias: createDto.dias,
        horarioEntrada: createDto.horarioEntrada,
        horarioSalida: createDto.horarioSalida,
        historia: createDto.historia,
        baner: createDto.baner,
        email: createDto.email,
        urlWeb: createDto.urlWeb,
        urlWhatsapp: createDto.urlWhatsapp,
        urlTiktok: createDto.urlTiktok,
        urlInstagram: createDto.urlInstagram,
        urlFacebook: createDto.urlFacebook,
        urlX: createDto.urlX,
        locales: {
          create: createDto.locales?.map((local) => ({
            localId: local.localId,
          })),
        },
        eventos: {
          create: createDto.eventos?.map((evento) => ({
            eventoId: evento.eventoId,
          })),
        },
        galeria: {
          create: createDto.galeria?.map((image) => ({
            url: image.url,
            name: image.name,
            description: image.description,
          })),
        },
      },
    });

    return lugar;
  }

  async findAll(queryParams: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { page = 1, limit = 10, search = '' } = queryParams;

    if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
    if (limit < 1 || limit > 100)
      throw new BadRequestException('El límite debe estar entre 1 y 100');

    const skip = (page - 1) * limit;

    const whereConditions = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as const } },
            { ubicacion: { contains: search, mode: 'insensitive' as const } },
            { descripcion: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [total, resultados] = await Promise.all([
      this.prisma.lugaresTuristicos.count({ where: whereConditions }),
      this.prisma.lugaresTuristicos.findMany({
        where: whereConditions,
        skip,
        take: Number(limit),
        include: {
          locales: { include: { local: true } },
          eventos: { include: { evento: true } },
          galeria: true,
        },
      }),
    ]);

    return {
      data: resultados,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async findOne(id: string) {
    const lugar = await this.prisma.lugaresTuristicos.findUnique({
      where: { id },
      include: {
        locales: { include: { local: true } },
        eventos: { include: { evento: true } },
        galeria: true,
      },
    });

    if (!lugar) {
      throw new NotFoundException(`Lugar turístico con ID ${id} no encontrado`);
    }

    return lugar;
  }

  async update(id: string, updateDto: UpdateLugaresTuristicoDto) {
    const existingLugar = await this.prisma.lugaresTuristicos.findUnique({
      where: { id },
    });
    if (!existingLugar) {
      throw new NotFoundException(`Lugar turístico con ID ${id} no encontrado`);
    }

    return this.prisma.lugaresTuristicos.update({
      where: { id },
      data: {
        ...updateDto,
        locales: updateDto.locales
          ? {
              connect: updateDto.locales.map((local) => ({
                id: local.localId,
              })),
            }
          : undefined,
        eventos: updateDto.eventos
          ? {
              connect: updateDto.eventos.map((evento) => ({
                id: evento.eventoId,
              })),
            }
          : undefined,
        galeria: updateDto.galeria
          ? {
              deleteMany: {},
              create: updateDto.galeria.map((image) => ({
                url: image.url,
                name: image.name,
                description: image.description,
              })),
            }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    const existingLugar = await this.prisma.lugaresTuristicos.findUnique({
      where: { id },
    });
    if (!existingLugar) {
      throw new NotFoundException(`Lugar turístico con ID ${id} no encontrado`);
    }

    return this.prisma.lugaresTuristicos.delete({ where: { id } });
  }

  async findByUrlX(urlX: string) {
    try {
      if (!urlX) {
        throw new BadRequestException('El urlX es requerido');
      }

      const lugares = await this.prisma.lugaresTuristicos.findMany({
        where: { urlX: { equals: urlX, mode: 'insensitive' } },
        include: {
          galeria: true,
          locales: { include: { local: true } },
          eventos: { include: { evento: true } },
        },
        orderBy: { nombre: 'asc' },
      });

      if (lugares.length === 0) {
        throw new NotFoundException(
          `No se encontraron lugares con urlX: ${urlX}`,
        );
      }

      return {
        data: lugares,
        meta: { total: lugares.length, urlX, found: true },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de base de datos: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
