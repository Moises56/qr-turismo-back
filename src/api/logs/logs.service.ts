// src/logs/logs.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(userId: string, message: string) {
    return this.prisma.log.create({ data: { userId, message } });
  }

  async findAll(queryParams: { page?: number; limit?: number }) {
    // Convertir explícitamente los valores a números, usando valores por defecto si son inválidos
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;

    // Validaciones
    if (page < 1) {
      throw new BadRequestException('La página debe ser mayor a 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('El límite debe estar entre 1 y 100');
    }

    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      this.prisma.log.count(),
      this.prisma.log.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              nombre: true, // Solo incluir el campo nombre del usuario
            },
          },
        },
      }),
    ]);

    // Mapear los logs para incluir el nombre del usuario
    const formattedLogs = logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      userName: log.user?.nombre || 'Usuario Desconocido', // Usar el nombre del usuario o "Usuario Desconocido" si no existe
      message: log.message,
      createdAt: log.createdAt,
    }));

    return {
      data: formattedLogs,
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
    return this.prisma.log.findUnique({ where: { id } });
  }

  async remove(id: string) {
    return this.prisma.log.delete({ where: { id } });
  }
}
