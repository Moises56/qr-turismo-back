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
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { LocalesService } from './locales.service';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

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
  @HttpCode(HttpStatus.CREATED) // 201 para creación exitosa
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un local (solo admin)' })
  @ApiResponse({ status: 201, description: 'Local creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(@Body() createLocaleDto: CreateLocaleDto, @Request() req) {
    try {
      const local = await this.localesService.create(createLocaleDto);
      await this.logsService.createLog(
        req.user.id,
        `Creó local: ${local.nombre}`,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Local guardado',
        data: {
          idLocal: local.idLocal,
          nombre: local.nombre,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear el local: ${error.message}`);
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        error: error.message || 'Error desconocido',
      };
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los locales (público)' })
  @ApiResponse({ status: 200, description: 'Lista de locales obtenida' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll() {
    try {
      const locales = await this.localesService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Locales obtenidos exitosamente',
        data: locales,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        error: error.message || 'Error desconocido',
      };
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un local por ID (público)' })
  @ApiResponse({ status: 200, description: 'Local encontrado' })
  @ApiResponse({ status: 404, description: 'Local no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id') id: string) {
    try {
      const local = await this.localesService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Local encontrado',
        data: local,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        };
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        error: error.message || 'Error desconocido',
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un local (solo admin)' })
  @ApiResponse({ status: 200, description: 'Local actualizado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Local no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateLocaleDto: UpdateLocaleDto,
    @Request() req,
  ) {
    try {
      const local = await this.localesService.update(id, updateLocaleDto);
      await this.logsService.createLog(
        req.user.id,
        `Actualizó local: ${local.nombre}`,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Local actualizado',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        };
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        error: error.message || 'Error desconocido',
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un local (solo admin)' })
  @ApiResponse({ status: 200, description: 'Local eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Local no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const local = await this.localesService.remove(id);
      await this.logsService.createLog(
        req.user.id,
        `Eliminó local: ${local.nombre}`,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Local eliminado',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        };
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        error: error.message || 'Error desconocido',
      };
    }
  }

  @Get('tipoLocal/:tipoLocalId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar locales por tipoLocalId (público)' })
  @ApiResponse({ status: 200, description: 'Locales obtenidos por tipo' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getByTipoLocal(@Param('tipoLocalId') tipoLocalId: string) {
    try {
      const locales = await this.localesService.findByTipoLocal(tipoLocalId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Locales obtenidos por tipo',
        data: locales,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        error: error.message || 'Error desconocido',
      };
    }
  }
}
