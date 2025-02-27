import { Controller, Get, Post, Body } from '@nestjs/common';
import { RutasTuristicasService } from './rutas-turisticas.service';
import { CreateRutasTuristicaDto } from './dto/create-rutas-turistica.dto';

@Controller('rutas-turisticas')
export class RutasTuristicasController {
  constructor(
    private readonly rutasTuristicasService: RutasTuristicasService,
  ) {}

  @Get()
  findAll() {
    return this.rutasTuristicasService.findAll();
  }

  @Post()
  create(@Body() createRutasTuristicaDto: CreateRutasTuristicaDto) {
    return this.rutasTuristicasService.create(createRutasTuristicaDto);
  }
}
