// src/rutas-turisticas/rutas-turisticas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRutasTuristicaDto } from './dto/create-rutas-turistica.dto';
import { UpdateRutasTuristicaDto } from './dto/update-rutas-turistica.dto';

@Injectable()
export class RutasTuristicasService {
  constructor(private prisma: PrismaService) {}

  async create(createRutasTuristicaDto: CreateRutasTuristicaDto) {
    const { nombre, lugares, lugaresRelIds } = createRutasTuristicaDto;
    return this.prisma.rutasTuristicas.create({
      data: {
        nombre,
        lugares: { create: lugares },
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
          include: { lugarTuristico: { include: { galeria: true } } },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.rutasTuristicas.findMany({
      include: {
        lugares: true,
        lugaresRel: {
          include: { lugarTuristico: { include: { galeria: true } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const ruta = await this.prisma.rutasTuristicas.findUnique({
      where: { id },
      include: {
        lugares: true,
        lugaresRel: {
          include: { lugarTuristico: { include: { galeria: true } } },
        },
      },
    });
    if (!ruta)
      throw new NotFoundException(`Ruta turística con ID ${id} no encontrada`);
    return ruta;
  }

  async update(id: string, updateRutasTuristicaDto: UpdateRutasTuristicaDto) {
    await this.findOne(id);

    const { lugaresRelIds, lugares, ...restData } = updateRutasTuristicaDto;

    // Primero actualiza los datos básicos y los lugares embebidos
    const updateData: any = {
      ...restData,
      ...(lugares && lugares.length > 0
        ? {
            lugares: {
              // Aquí podrías decidir si quieres reemplazar todos o crear/actualizar específicos
              // La estrategia depende de tu caso de uso
              deleteMany: {},
              create: lugares,
            },
          }
        : {}),
    };

    // Realiza la actualización básica
    const updatedRuta = await this.prisma.rutasTuristicas.update({
      where: { id },
      data: updateData,
      include: {
        lugares: true,
        lugaresRel: {
          include: { lugarTuristico: { include: { galeria: true } } },
        },
      },
    });

    // Si hay lugaresRelIds, maneja las relaciones por separado
    if (lugaresRelIds && lugaresRelIds.length > 0) {
      // Primero elimina todas las relaciones existentes
      await this.prisma.rutaRel.deleteMany({
        where: { rutaId: id },
      });

      // Luego crea las nuevas relaciones
      for (const [index, lugarId] of lugaresRelIds.entries()) {
        await this.prisma.rutaRel.create({
          data: {
            ruta: { connect: { id } },
            lugarTuristico: { connect: { id: lugarId } },
            orden: index + 1,
          },
        });
      }

      // Vuelve a obtener la ruta con las relaciones actualizadas
      return this.findOne(id);
    }

    return updatedRuta;
  }

  async remove(id: string) {
    await this.findOne(id);

    // Primero elimina las relaciones
    await this.prisma.rutaRel.deleteMany({
      where: { rutaId: id },
    });

    // También deberías eliminar los lugares embebidos (si es que no se eliminan en cascada)
    await this.prisma.lugarRuta.deleteMany({
      where: { rutaId: id },
    });

    // Finalmente elimina la ruta
    return this.prisma.rutasTuristicas.delete({ where: { id } });
  }
}
