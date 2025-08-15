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

  // async findOne(id: string) {
  //   const lugar = await this.prisma.lugaresTuristicos.findUnique({
  //     where: { id },
  //     include: {
  //       locales: { include: { local: true } },
  //       eventos: { include: { evento: true } },
  //       galeria: true,
  //     },
  //   });

  //   if (!lugar) {
  //     throw new NotFoundException(`Lugar turístico con ID ${id} no encontrado`);
  //   }

  //   return lugar;
  // }

  async findOne(id: string) {
    // Validar si el id es un ObjectId válido (24 caracteres hexadecimales)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      throw new BadRequestException(`El ID "${id}" no es un ObjectId válido`);
    }

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

    // Verificar relaciones existentes antes de eliminar
    const [eventos, locales, rutas, imagenes, atracciones] = await Promise.all([
      this.prisma.eventoRel.count({ where: { lugarTuristicoId: id } }),
      this.prisma.localRel.count({ where: { lugarTuristicoId: id } }),
      this.prisma.rutaRel.count({ where: { lugarTuristicoId: id } }),
      this.prisma.imageItem.count({ where: { lugarId: id } }),
      this.prisma.attraction.count({ where: { lugarId: id } }),
    ]);

    // Crear mensaje informativo sobre las relaciones
    const relaciones = [];
    if (eventos > 0) relaciones.push(`${eventos} evento(s)`);
    if (locales > 0) relaciones.push(`${locales} local(es)`);
    if (rutas > 0) relaciones.push(`${rutas} ruta(s) turística(s)`);
    if (imagenes > 0) relaciones.push(`${imagenes} imagen(es)`);
    if (atracciones > 0) relaciones.push(`${atracciones} atracción(es)`);

    if (relaciones.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el lugar turístico "${existingLugar.nombre}" porque tiene ${relaciones.join(', ')} relacionado(s). ` +
        `Para eliminarlo, primero debe eliminar estas relaciones o contacte al administrador del sistema.`
      );
    }

    // Si no hay relaciones, proceder con la eliminación
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

  // src/api/lugares-turisticos/lugares-turisticos.service.ts
  async findByUrlXDash(urlX: string, page: string = '1', limit: string = '10') {
    try {
      if (!urlX) {
        throw new BadRequestException('El urlX es requerido');
      }

      // Convertir page y limit a enteros
      const pageNum = parseInt(page, 10); // Base 10 para evitar problemas
      const limitNum = parseInt(limit, 10);

      // Validar que los valores sean números válidos
      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new BadRequestException(
          'Los parámetros page y limit deben ser números positivos válidos',
        );
      }

      const skip = (pageNum - 1) * limitNum;

      const [lugares, total] = await Promise.all([
        this.prisma.lugaresTuristicos.findMany({
          where: { urlX: { equals: urlX, mode: 'insensitive' } },
          include: {
            galeria: true,
            locales: { include: { local: true } },
            eventos: { include: { evento: true } },
          },
          orderBy: { key: 'asc' }, // Cambio aquí: ordenar por 'key' ascendente
          skip,
          take: limitNum,
        }),
        this.prisma.lugaresTuristicos.count({
          where: { urlX: { equals: urlX, mode: 'insensitive' } },
        }),
      ]);

      if (lugares.length === 0) {
        throw new NotFoundException(
          `No se encontraron lugares con urlX: ${urlX}`,
        );
      }

      return {
        data: lugares,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      };
    } catch (error) {
      console.error('Error in findByUrlXDash:', error);
      if (error instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Error de base de datos: ${error.message}`,
        );
      }
      throw error;
    }
  }

  // Obtener el último registro de la tabla y mostrar solo el key
  async getUltimoRegistro(): Promise<{ key: string } | null> {
    try {
      const lugar = await this.prisma.lugaresTuristicos.findFirst({
        select: { key: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      return lugar;
    } catch (error) {
      console.error('Error al obtener el último registro:', error);
      throw new InternalServerErrorException(
        'Error al obtener el último registro',
      );
    }
  }

  // Obtener el siguiente key disponible
  async getNextKey() {
    try {
      const ultimoRegistro = await this.getUltimoRegistro();

      // Si no hay registros, devolver "1"
      if (!ultimoRegistro || !ultimoRegistro.key) {
        return { nextKey: '1' };
      }

      // Convertir el último key a número y sumar 1
      const ultimoKey = parseInt(ultimoRegistro.key, 10);
      if (isNaN(ultimoKey)) {
        throw new InternalServerErrorException(
          `El último key (${ultimoRegistro.key}) no es un número válido`,
        );
      }

      const nextKey = (ultimoKey + 1).toString();
      return { nextKey };
    } catch (error) {
      console.error('Error al obtener el siguiente key:', error);
      throw new InternalServerErrorException(
        `Error al obtener el siguiente key: ${error.message}`,
      );
    }
  }

  //* lugares turisticos sin paginacion
  async getLugaresT() {
    try {
      const lugares = await this.prisma.lugaresTuristicos.findMany({
        include: {
          locales: { include: { local: true } },
          eventos: { include: { evento: true } },
          galeria: true,
        },
      });
      return lugares;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener todos los lugares turísticos',
      );
    }
  }
}
