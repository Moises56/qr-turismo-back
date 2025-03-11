// src/lugares-turisticos/lugares-turisticos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LugaresTuristicosService } from './lugares-turisticos.service';
import { CreateLugaresTuristicoDto } from './dto/create-lugares-turistico.dto';
import { UpdateLugaresTuristicoDto } from './dto/update-lugares-turistico.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('lugares-turisticos')
@Controller('lugares-turisticos')
export class LugaresTuristicosController {
  constructor(
    private readonly lugaresTuristicosService: LugaresTuristicosService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un lugar turístico (solo admin)' })
  async create(
    @Body() createLugaresTuristicoDto: CreateLugaresTuristicoDto,
    @Request() req,
  ) {
    const lugar = await this.lugaresTuristicosService.create(
      createLugaresTuristicoDto,
    );
    await this.logsService.createLog(
      req.user.id,
      `Creó lugar turístico: ${lugar.nombre}`,
    );
    return lugar;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los lugares turísticos (público)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10, // Ajustado a 10 para consistencia
    @Query('search') search: string = '',
  ) {
    return this.lugaresTuristicosService.findAll({ page, limit, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lugar turístico por ID (público)' })
  findOne(@Param('id') id: string) {
    return this.lugaresTuristicosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un lugar turístico (solo admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateLugaresTuristicoDto: UpdateLugaresTuristicoDto,
    @Request() req,
  ) {
    const lugar = await this.lugaresTuristicosService.update(
      id,
      updateLugaresTuristicoDto,
    );
    await this.logsService.createLog(
      req.user.id,
      `Actualizó lugar turístico: ${lugar.nombre}`,
    );
    return lugar;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un lugar turístico (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const lugar = await this.lugaresTuristicosService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó lugar turístico: ${lugar.nombre}`,
    );
    return lugar;
  }

  @Get('urlX/:urlX')
  @ApiOperation({ summary: 'Buscar lugares turísticos por urlX (público)' })
  async getLugaresByUrlX(@Param('urlX') urlX: string) {
    try {
      return await this.lugaresTuristicosService.findByUrlX(urlX);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'Error al buscar lugares turísticos',
      );
    }
  }
}
