import { Injectable } from '@nestjs/common';
import { CreateSuscribeDto } from './dto/create-suscribe.dto';
import { UpdateSuscribeDto } from './dto/update-suscribe.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuscribeService {
  constructor(private prisma: PrismaService) {}

  async create(createSuscribeDto: CreateSuscribeDto) {
    // Convert eventDate to a valid ISO-8601 format if it's provided
    const formattedEventDate = new Date(createSuscribeDto.eventDate);
  
    // Add the formatted date back into the DTO
    const data = {
      ...createSuscribeDto,
      eventDate: formattedEventDate,
    };
  
    // Insert the data into the database
    return this.prisma.suscripcion.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.suscripcion.findMany();
  }

  async findOne(id: number) {
    return this.prisma.suscripcion.findUnique({
      where: { id: id.toString() },
    });
  }

  async update(id: number, updateSuscribeDto: UpdateSuscribeDto) {
    return await this.prisma.suscripcion.update({
      where: { id: id.toString() },
      data: updateSuscribeDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.suscripcion.delete({
      where: { id: id.toString() },
    });
  }
}
