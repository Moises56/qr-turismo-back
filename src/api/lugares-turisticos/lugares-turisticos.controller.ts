import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LugaresTuristicosService } from './lugares-turisticos.service';
import { CreateLugaresTuristicoDto } from './dto/create-lugares-turistico.dto';
import { UpdateLugaresTuristicoDto } from './dto/update-lugares-turistico.dto';

@Controller('lugares-turisticos')
export class LugaresTuristicosController {
  constructor(
    private readonly lugaresTuristicosService: LugaresTuristicosService,
  ) {}

  @Post()
  create(@Body() createLugaresTuristicoDto: CreateLugaresTuristicoDto) {
    return this.lugaresTuristicosService.create(createLugaresTuristicoDto);
  }

  @Get()
  findAll() {
    return this.lugaresTuristicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lugaresTuristicosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLugaresTuristicoDto: UpdateLugaresTuristicoDto,
  ) {
    return this.lugaresTuristicosService.update(id, updateLugaresTuristicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lugaresTuristicosService.remove(id);
  }
}
