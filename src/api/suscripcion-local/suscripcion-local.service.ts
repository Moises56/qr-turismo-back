import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuscripcionLocalDto } from './dto/create-suscripcion-local.dto';
import { UpdateSuscripcionLocalDto } from './dto/update-suscripcion-local.dto';

@Injectable()
export class SuscripcionLocalService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSuscripcionLocalDto) {
    try {
      // Validar formato RTN/DNI
      if (createDto.rtnDni) {
        if (createDto.rtnDni.length !== 13 && createDto.rtnDni.length !== 14) {
          throw new BadRequestException(
            'RTN debe tener 14 dígitos o DNI debe tener 13 dígitos',
          );
        }
      }

      // Crear la suscripción
      return this.prisma.suscripcionLocal.create({
        data: {
          nombreLocal: createDto.nombreLocal,
          tipoLocal: createDto.tipoLocal,
          latitud: createDto.latitud,
          longitud: createDto.longitud,
          direccion: createDto.direccion,
          rtnDni: createDto.rtnDni,
          permisoOperacion: createDto.permisoOperacion,
          telefonoLocal: createDto.telefonoLocal,
          nombrePropietario: createDto.nombrePropietario,
          telefonoPropietario: createDto.telefonoPropietario,
          email: createDto.email,
          urlWeb: createDto.urlWeb,
          urlWhatsapp: createDto.urlWhatsapp,
          urlTiktok: createDto.urlTiktok,
          urlInstagram: createDto.urlInstagram,
          urlFacebook: createDto.urlFacebook,
          urlX: createDto.urlX,
          registroNacionalTurismo: createDto.registroNacionalTurismo,
          urlImagenRegistroTurismo: createDto.urlImagenRegistroTurismo,
          tipoLocalId: createDto.tipoLocalId,
          status: 'pending', // Por defecto es pendiente
        },
        include: {
          tipoLocalRef: true,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al crear la suscripción de local: ' + error.message,
      );
    }
  }

  async findAll(queryParams: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    // Convertir explícitamente los valores a números, usando valores por defecto
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtrar por status si se proporciona
    const where = queryParams.status ? { status: queryParams.status } : {};

    try {
      const [suscripciones, total] = await Promise.all([
        this.prisma.suscripcionLocal.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            tipoLocalRef: true,
          },
        }),
        this.prisma.suscripcionLocal.count({ where }),
      ]);

      return {
        data: suscripciones,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Error al buscar suscripciones: ' + error.message,
      );
    }
  }

  async findOne(id: string) {
    try {
      const suscripcion = await this.prisma.suscripcionLocal.findUnique({
        where: { id },
        include: {
          tipoLocalRef: true,
        },
      });

      if (!suscripcion) {
        throw new NotFoundException('Suscripción de local no encontrada');
      }

      return suscripcion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al buscar la suscripción: ' + error.message,
      );
    }
  }

  async update(id: string, updateDto: UpdateSuscripcionLocalDto) {
    try {
      // Verificar si existe la suscripción
      const exists = await this.prisma.suscripcionLocal.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new NotFoundException('Suscripción de local no encontrada');
      }

      // Validar formato RTN/DNI si se proporciona
      if (updateDto.rtnDni) {
        if (updateDto.rtnDni.length !== 13 && updateDto.rtnDni.length !== 14) {
          throw new BadRequestException(
            'RTN debe tener 14 dígitos o DNI debe tener 13 dígitos',
          );
        }
      }

      // Actualizar la suscripción
      return this.prisma.suscripcionLocal.update({
        where: { id },
        data: updateDto,
        include: {
          tipoLocalRef: true,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Error al actualizar la suscripción: ' + error.message,
      );
    }
  }

  async remove(id: string) {
    try {
      // Verificar si existe la suscripción
      const exists = await this.prisma.suscripcionLocal.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new NotFoundException('Suscripción de local no encontrada');
      }

      // Eliminar la suscripción
      return this.prisma.suscripcionLocal.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al eliminar la suscripción: ' + error.message,
      );
    }
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    try {
      // Verificar si existe la suscripción
      const exists = await this.prisma.suscripcionLocal.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new NotFoundException('Suscripción de local no encontrada');
      }

      // Validar el estado
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        throw new BadRequestException(
          'Estado no válido. Debe ser: pending, approved o rejected',
        );
      }

      // Actualizar el estado
      return this.prisma.suscripcionLocal.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Error al actualizar el estado: ' + error.message,
      );
    }
  }
}
