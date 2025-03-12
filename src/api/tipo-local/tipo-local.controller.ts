import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { TipoLocalService } from './tipo-local.service';
import { CreateTipoLocalDto } from './dto/create-tipo-local.dto';
import { UpdateTipoLocalDto } from './dto/update-tipo-local.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('tipo-local')
@Controller('tipo-local')
export class TipoLocalController {
  constructor(
    private readonly tipoLocalService: TipoLocalService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un tipo de local (solo admin)' })
  async create(@Body() createTipoLocalDto: CreateTipoLocalDto, @Request() req) {
    const tipoLocal = await this.tipoLocalService.create(createTipoLocalDto);
    await this.logsService.createLog(
      req.user.id,
      `Creó tipo de local: ${tipoLocal.nombreTipo}`,
    );
    return tipoLocal;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tipos de local (público)' })
  findAll() {
    return this.tipoLocalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de local por ID (público)' })
  findOne(@Param('id') id: string) {
    return this.tipoLocalService.findOne(id);
  }

  @Patch(':id')
  @Put(':id') // Añadimos soporte para PUT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un tipo de local (solo admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateTipoLocalDto: UpdateTipoLocalDto,
    @Request() req,
  ) {
    try {
      const tipoLocal = await this.tipoLocalService.update(
        id,
        updateTipoLocalDto,
      );
      await this.logsService.createLog(
        req.user.id,
        `Actualizó tipo de local: ${tipoLocal.nombreTipo}`,
      );
      return tipoLocal;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Tipo de local con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un tipo de local (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const tipoLocal = await this.tipoLocalService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó tipo de local: ${tipoLocal.nombreTipo}`,
    );
    return tipoLocal;
  }

  @Get('filter-by-description/:descripcion')
  @ApiOperation({ summary: 'Filtrar tipos de local por descripción (público)' })
  filterByDescription(@Param('descripcion') descripcion: string) {
    return this.tipoLocalService.filterByDescription(descripcion);
  }
}
