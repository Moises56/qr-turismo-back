import { Injectable } from '@nestjs/common';
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
        urlWhatsapp: createDto.urlWeb,
        urlTiktok: createDto.urlWeb,
        urlInstagram: createDto.urlWeb,
        urlFacebook: createDto.urlWeb,
        urlX: createDto.urlWeb,

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

  async findAll() {
    return this.prisma.lugaresTuristicos.findMany({
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
