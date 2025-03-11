// src/suscribe/suscribe.controller.ts
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
import { SuscribeService } from './suscribe.service';
import { CreateSuscribeDto } from './dto/create-suscribe.dto';
import { UpdateSuscribeDto } from './dto/update-suscribe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('suscribe')
@Controller('suscribe')
export class SuscribeController {
  constructor(
    private readonly suscribeService: SuscribeService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Crear una suscripción (solo admin)' })
  async create(@Body() createSuscribeDto: CreateSuscribeDto, @Request() req) {
    const suscripcion = await this.suscribeService.create(createSuscribeDto);
    await this.logsService.createLog(
      req.user.id,
      `Creó suscripción para: ${suscripcion.email}`,
    );
    return suscripcion;
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Listar todas las suscripciones (solo admin)' })
  findAll() {
    return this.suscribeService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una suscripción por ID (solo admin)' })
  findOne(@Param('id') id: string) {
    return this.suscribeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una suscripción (solo admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateSuscribeDto: UpdateSuscribeDto,
    @Request() req,
  ) {
    const suscripcion = await this.suscribeService.update(
      id,
      updateSuscribeDto,
    );
    await this.logsService.createLog(
      req.user.id,
      `Actualizó suscripción para: ${suscripcion.email}`,
    );
    return suscripcion;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una suscripción (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const suscripcion = await this.suscribeService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó suscripción para: ${suscripcion.email}`,
    );
    return suscripcion;
  }
}
