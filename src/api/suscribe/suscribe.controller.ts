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
  @ApiOperation({ summary: 'Crear una suscripción (público)' })
  async create(@Body() createSuscribeDto: CreateSuscribeDto, @Request() req) {
    const suscripcion = await this.suscribeService.create(createSuscribeDto);
    // Registrar log incluso para usuarios no autenticados
    const userId = req.user?.id || 'anonymous';
    await this.logsService.createLog(
      userId,
      `Creó suscripción para: ${suscripcion.email} (${suscripcion.artisticName || 'Sin nombre artístico'})`,
    );
    return suscripcion;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las suscripciones (admin y turismo)' })
  findAll() {
    return this.suscribeService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una suscripción por ID (admin y turismo)' })
  findOne(@Param('id') id: string) {
    return this.suscribeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una suscripción (admin y turismo)' })
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
      `Actualizó suscripción para: ${suscripcion.email} (${suscripcion.artisticName || 'Sin nombre artístico'}) - Nuevo estado: ${suscripcion.status}`,
    );
    return suscripcion;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una suscripción (admin y turismo)' })
  async remove(@Param('id') id: string, @Request() req) {
    const suscripcion = await this.suscribeService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó suscripción para: ${suscripcion.email} (${suscripcion.artisticName || 'Sin nombre artístico'})`,
    );
    return suscripcion;
  }
}
