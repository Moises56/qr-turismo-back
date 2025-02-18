import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLugaresTuristicoDto } from './dto/create-lugares-turistico.dto';
import { UpdateLugaresTuristicoDto } from './dto/update-lugares-turistico.dto';
import { PrismaService } from '../../prisma/prisma.service';

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

        // Crear las relaciones con locales (usando LocalRel)
        locales: {
          create: createDto.locales?.map((local) => ({
            localId: local.localId, // Crear relación con el ID del local
          })),
        },

        // Crear las relaciones con eventos (usando EventoRel)
        eventos: {
          create: createDto.eventos?.map((evento) => ({
            eventoId: evento.eventoId, // Crear relación con el ID del evento
          })),
        },

        // Crear relaciones con imágenes
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

  // async findAll() {
  //   return this.prisma.lugaresTuristicos.findMany({
  //     include: {
  //       locales: {
  //         include: {
  //           local: true,
  //         },
  //       },
  //       eventos: {
  //         include: {
  //           evento: true,
  //         },
  //       },
  //       galeria: true, // Incluir las imágenes de la galería
  //     },
  //   });
  // }

  // async findAll(queryParams: {
  //   page?: number;
  //   limit?: number;
  //   search?: string;
  // }) {
  //   const { page = 1, limit = 10, search = '' } = queryParams;
  //   const skip = (page - 1) * limit;

  //   return this.prisma.lugaresTuristicos.findMany({
  //     where: {
  //       OR: search
  //         ? [
  //             { nombre: { contains: search, mode: 'insensitive' } },
  //             { ubicacion: { contains: search, mode: 'insensitive' } },
  //             { descripcion: { contains: search, mode: 'insensitive' } },
  //           ]
  //         : undefined,
  //     },
  //     skip,
  //     take: limit,
  //     include: {
  //       locales: { include: { local: true } },
  //       eventos: { include: { evento: true } },
  //       galeria: true,
  //     },
  //   });
  // }

  async findAll(queryParams: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { page = 1, limit = 20, search = '' } = queryParams;

    // Validación
    if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');
    if (limit < 1 || limit > 100)
      throw new BadRequestException('El límite debe estar entre 1 y 100');

    const skip = (page - 1) * limit;

    // Corregir estructura de condiciones
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
        take: limit,
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
        galeria: true, // Incluir las imágenes de la galería
      },
    });
  }

  async update(id: string, updateDto: UpdateLugaresTuristicoDto) {
    return this.prisma.lugaresTuristicos.update({
      where: { id },
      data: {
        ...updateDto,
        locales: updateDto.locales
          ? {
              connect: updateDto.locales.map((local) => ({
                id: local.localId, // Aquí nos aseguramos de que estamos usando el ID del local para conectar
              })),
            }
          : undefined,

        eventos: updateDto.eventos
          ? {
              connect: updateDto.eventos.map((evento) => ({
                id: evento.eventoId, // Aquí usamos el ID del evento para conectarlo
              })),
            }
          : undefined,

        galeria: updateDto.galeria
          ? {
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
    return this.prisma.lugaresTuristicos.delete({ where: { id } });
  }
}
