// src/rutas-turisticas/rutas-turisticas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RutasTuristicasService } from './rutas-turisticas.service';
import { CreateRutasTuristicaDto } from './dto/create-rutas-turistica.dto';
import { UpdateRutasTuristicaDto } from './dto/update-rutas-turistica.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('rutas-turisticas')
@Controller('rutas-turisticas')
export class RutasTuristicasController {
  constructor(
    private readonly rutasTuristicasService: RutasTuristicasService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una ruta turística (admin y turismo)' })
  async create(
    @Body() createRutasTuristicaDto: CreateRutasTuristicaDto,
    @Request() req,
  ) {
    const ruta = await this.rutasTuristicasService.create(
      createRutasTuristicaDto,
    );
    await this.logsService.createLog(
      req.user.id,
      `Creó ruta turística: ${ruta.nombre}`,
    );
    return ruta;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las rutas turísticas (público)' })
  findAll() {
    return this.rutasTuristicasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ruta turística por ID (público)' })
  findOne(@Param('id') id: string) {
    return this.rutasTuristicasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una ruta turística (admin y turismo)' })
  async update(
    @Param('id') id: string,
    @Body() updateRutasTuristicaDto: UpdateRutasTuristicaDto,
    @Request() req,
  ) {
    const ruta = await this.rutasTuristicasService.update(
      id,
      updateRutasTuristicaDto,
    );
    await this.logsService.createLog(
      req.user.id,
      `Actualizó ruta turística: ${ruta.nombre}`,
    );
    return ruta;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una ruta turística (admin y turismo)' })
  async remove(@Param('id') id: string, @Request() req) {
    const ruta = await this.rutasTuristicasService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó ruta turística: ${ruta.nombre}`,
    );
    return ruta;
  }
}
