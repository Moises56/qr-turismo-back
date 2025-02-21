import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';

@Injectable()
export class AttractionService {
  constructor(private prisma: PrismaService) {}

  async create(createAttractionDto: CreateAttractionDto) {
    return this.prisma.attraction.create({
      data: createAttractionDto,
    });
  }

  async findAll() {
    return this.prisma.attraction.findMany();
  }

  async findOne(id: string) {
    return this.prisma.attraction.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAttractionDto: UpdateAttractionDto) {
    return this.prisma.attraction.update({
      where: { id },
      data: updateAttractionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.attraction.delete({
      where: { id },
    });
  }
}
