// src/locales/locales.controller.ts
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
import { LocalesService } from './locales.service';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('locales')
@Controller('locales')
export class LocalesController {
  constructor(
    private readonly localesService: LocalesService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un local (solo admin)' })
  async create(@Body() createLocaleDto: CreateLocaleDto, @Request() req) {
    const local = await this.localesService.create(createLocaleDto);
    await this.logsService.createLog(
      req.user.id,
      `Creó local: ${local.nombre}`,
    );
    return local;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los locales (público)' })
  findAll() {
    return this.localesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un local por ID (público)' })
  findOne(@Param('id') id: string) {
    return this.localesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un local (solo admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateLocaleDto: UpdateLocaleDto,
    @Request() req,
  ) {
    const local = await this.localesService.update(id, updateLocaleDto);
    await this.logsService.createLog(
      req.user.id,
      `Actualizó local: ${local.nombre}`,
    );
    return local;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un local (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const local = await this.localesService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó local: ${local.nombre}`,
    );
    return local;
  }

  @Get('tipoLocal/:tipoLocalId')
  @ApiOperation({ summary: 'Listar locales por tipoLocalId (público)' })
  getByTipoLocal(@Param('tipoLocalId') tipoLocalId: string) {
    return this.localesService.findByTipoLocal(tipoLocalId);
  }
}
