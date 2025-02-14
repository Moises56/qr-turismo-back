import { Injectable } from '@nestjs/common';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocalesService {
  constructor(private prisma: PrismaService) {}

  async create(createLocalDto: CreateLocaleDto) {
    return this.prisma.local.create({
      data: {
        tipoLocal: { connect: { id: createLocalDto.tipoLocalId } }, // Conecta la relación con TipoLocal usando el ID
        nombre: createLocalDto.nombre,
        descripcion: createLocalDto.descripcion,
        horario: createLocalDto.horario,
        telefono: createLocalDto.telefono,
        direccion: createLocalDto.direccion,
        banerLocal: createLocalDto.banerLocal,
        email: createLocalDto.email,
        latitud: createLocalDto.latitud,
        longitud: createLocalDto.longitud,
        urlWeb: createLocalDto.urlWeb,
        urlWhatsapp: createLocalDto.urlWhatsapp,
        urlFacebook: createLocalDto.urlFacebook,
        urlInstagram: createLocalDto.urlInstagram,
        urlTiktok: createLocalDto.urlTiktok,
        urlX: createLocalDto.urlX,
        // relación con LugaresTuristicos (a través de LocalRel)
        lugares: {
          create: createLocalDto.lugaresIds?.map((id) => ({
            lugarTuristico: { connect: { id } },
          })),
        },
      },
      include: {
        lugares: true, // Incluir los registros creados en EventoRel
      },
    });
  }

  async findAll() {
    return this.prisma.local.findMany({
      include: {
        tipoLocal: true,
        lugares: {
          include: {
            lugarTuristico: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.local.findUnique({
      where: { idLocal: id },
      include: {
        tipoLocal: true,
        lugares: {
          include: {
            lugarTuristico: true,
          },
        },
      },
    });
  }

  async update(id: string, updateLocalDto: UpdateLocaleDto) {
    return this.prisma.local.update({
      where: { idLocal: id },
      data: {
        tipoLocal: { connect: { id: updateLocalDto.tipoLocalId } }, // Conecta la relación con TipoLocal
        nombre: updateLocalDto.nombre,
        descripcion: updateLocalDto.descripcion,
        horario: updateLocalDto.horario,
        telefono: updateLocalDto.telefono,
        direccion: updateLocalDto.direccion,
        banerLocal: updateLocalDto.banerLocal,
        lugares: {
          connect: updateLocalDto.lugaresIds.map((id) => ({ id: id })),
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.local.delete({ where: { idLocal: id } });
  }

  // Método para buscar locales por tipoLocalId
  async findByTipoLocal(tipoLocalId: string) {
    return this.prisma.local.findMany({
      where: {
        tipoLocalId: tipoLocalId,
      },
      include: {
        tipoLocal: true, // Incluir información del tipoLocal
        lugares: true, // Opcional: incluir la relación con lugares
      },
    });
  }
}
