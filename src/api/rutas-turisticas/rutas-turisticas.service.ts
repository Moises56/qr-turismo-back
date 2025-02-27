import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRutasTuristicaDto } from './dto/create-rutas-turistica.dto';

@Injectable()
export class RutasTuristicasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.rutasTuristicas.findMany({
      include: {
        lugares: true,
        lugaresRel: {
          include: {
            lugarTuristico: {
              include: {
                galeria: true,
              },
            },
          },
        },
      },
    });
  }

  async create(createRutasTuristicaDto: CreateRutasTuristicaDto) {
    const { nombre, lugares, lugaresRelIds } = createRutasTuristicaDto;

    return this.prisma.rutasTuristicas.create({
      data: {
        nombre,
        lugares: {
          create: lugares.map((lugar) => ({
            nombre: lugar.nombre,
            lat: lugar.lat,
            lng: lugar.lng,
            description: lugar.description,
            coverImage: lugar.coverImage,
            gallery: lugar.gallery || [],
          })),
        },
        lugaresRel: lugaresRelIds
          ? {
              create: lugaresRelIds.map((id, index) => ({
                lugarTuristico: { connect: { id } },
                orden: index + 1,
              })),
            }
          : undefined,
      },
      include: {
        lugares: true,
        lugaresRel: {
          include: {
            lugarTuristico: {
              include: {
                galeria: true,
              },
            },
          },
        },
      },
    });
  }
}
