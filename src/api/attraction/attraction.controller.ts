// src/attraction/attraction.controller.ts
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
import { AttractionService } from './attraction.service';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LogsService } from '../logs/logs.service';

@ApiTags('attractions')
@Controller('attractions')
export class AttractionController {
  constructor(
    private readonly attractionService: AttractionService,
    private readonly logsService: LogsService, // Inyectamos LogsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva atracción (solo admin)' })
  @ApiResponse({ status: 201, description: 'Atracción creada' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async create(
    @Body() createAttractionDto: CreateAttractionDto,
    @Request() req,
  ) {
    const attraction = await this.attractionService.create(createAttractionDto);
    await this.logsService.createLog(
      req.user.id,
      `Creó atracción: ${attraction.nombre}`,
    );
    return attraction;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las atracciones (público)' })
  @ApiResponse({ status: 200, description: 'Lista de atracciones' })
  findAll() {
    return this.attractionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una atracción por ID (público)' })
  @ApiResponse({ status: 200, description: 'Atracción encontrada' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  findOne(@Param('id') id: string) {
    return this.attractionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una atracción (solo admin)' })
  @ApiResponse({ status: 200, description: 'Atracción actualizada' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateAttractionDto: UpdateAttractionDto,
    @Request() req,
  ) {
    const attraction = await this.attractionService.update(
      id,
      updateAttractionDto,
    );
    await this.logsService.createLog(
      req.user.id,
      `Actualizó atracción: ${attraction.nombre}`,
    );
    return attraction;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una atracción (solo admin)' })
  @ApiResponse({ status: 200, description: 'Atracción eliminada' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async remove(@Param('id') id: string, @Request() req) {
    const attraction = await this.attractionService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó atracción: ${attraction.nombre}`,
    );
    return attraction;
  }
}
