// src/eventos/eventos.controller.ts
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
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('eventos')
@Controller('eventos')
export class EventosController {
  constructor(
    private readonly eventosService: EventosService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un evento (solo admin)' })
  async create(@Body() createEventoDto: CreateEventoDto, @Request() req) {
    if (typeof createEventoDto.fechaEvento === 'string') {
      createEventoDto.fechaEvento = new Date(createEventoDto.fechaEvento);
    }
    const evento = await this.eventosService.create(createEventoDto);
    await this.logsService.createLog(
      req.user.id,
      `Creó evento: ${evento.nombreEvento}`,
    );
    return evento;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los eventos (público)' })
  findAll() {
    return this.eventosService.findAll();
  }

  @Get('tipos')
  @ApiOperation({
    summary: 'Obtener los tipos de eventos disponibles (público)',
  })
  getEventTypes() {
    return this.eventosService.getEventTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por ID (público)' })
  findOne(@Param('id') id: string) {
    return this.eventosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un evento (solo admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
    @Request() req,
  ) {
    const evento = await this.eventosService.update(id, updateEventoDto);
    await this.logsService.createLog(
      req.user.id,
      `Actualizó evento: ${evento.nombreEvento}`,
    );
    return evento;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un evento (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const evento = await this.eventosService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó evento: ${evento.nombreEvento}`,
    );
    return evento;
  }
}
