// src/rutas-turisticas/rutas-turisticas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRutasTuristicaDto } from './dto/create-rutas-turistica.dto';
import { UpdateRutasTuristicaDto } from './dto/update-rutas-turistica.dto';

@Injectable()
export class RutasTuristicasService {
  constructor(private prisma: PrismaService) {}

  async create(createRutasTuristicaDto: CreateRutasTuristicaDto) {
    const { nombre, lugares, lugaresRelIds, requisitos, ...nuevosCampos } =
      createRutasTuristicaDto;
    return this.prisma.rutasTuristicas.create({
      data: {
        nombre,
        ...nuevosCampos, // Incluye todos los nuevos campos opcionales
        lugares: { create: lugares },
        lugaresRel: lugaresRelIds
          ? {
              create: lugaresRelIds.map((id, index) => ({
                lugarTuristico: { connect: { id } },
                orden: index + 1,
              })),
            }
          : undefined,
        requisitos: requisitos
          ? {
              create: requisitos.map((req) => ({
                tipo: req.tipo,
                detalle: req.detalle,
              })),
            }
          : undefined,
      },
      include: {
        lugares: true,
        requisitos: true,
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
        requisitos: true,
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
        requisitos: true,
        lugaresRel: {
          include: { lugarTuristico: { include: { galeria: true } } },
        },
      },
    });
    if (!ruta)
      throw new NotFoundException(`Ruta turística con ID ${id} no encontrada`);
    
    // Calcular cantidad de lugares dinámicamente
    const cantidadLugaresCalculada =
      (ruta.lugares?.length || 0) + (ruta.lugaresRel?.length || 0);
    
    return {
      ...ruta,
      cantidadLugaresCalculada,
    };
  }

  async update(id: string, updateRutasTuristicaDto: UpdateRutasTuristicaDto) {
    await this.findOne(id);

    const { lugaresRelIds, lugares, requisitos, ...restData } =
      updateRutasTuristicaDto;

    // Primero actualiza los datos básicos y los lugares embebidos
    const updateData: any = {
      ...restData,
      ...(lugares && lugares.length > 0
        ? {
            lugares: {
              // Reemplazar todos los lugares embebidos
              deleteMany: {},
              create: lugares,
            },
          }
        : {}),
      ...(requisitos && requisitos.length > 0
        ? {
            requisitos: {
              // Reemplazar todos los requisitos
              deleteMany: {},
              create: requisitos.map((req) => ({
                tipo: req.tipo,
                detalle: req.detalle,
              })),
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
        requisitos: true,
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

    // Eliminar los requisitos
    await this.prisma.requisitoRuta.deleteMany({
      where: { rutaId: id },
    });

    // También elimina los lugares embebidos (si es que no se eliminan en cascada)
    await this.prisma.lugarRuta.deleteMany({
      where: { rutaId: id },
    });

    // Finalmente elimina la ruta
    return this.prisma.rutasTuristicas.delete({ where: { id } });
  }

  // Método adicional para gestionar requisitos
  async addRequisito(rutaId: string, tipo: string, detalle: string) {
    await this.findOne(rutaId); // Verificar que la ruta existe
    return this.prisma.requisitoRuta.create({
      data: {
        tipo,
        detalle,
        rutaId,
      },
    });
  }

  async removeRequisito(requisitoId: string) {
    return this.prisma.requisitoRuta.delete({
      where: { id: requisitoId },
    });
  }
}
