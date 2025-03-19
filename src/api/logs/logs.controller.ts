// src/logs/logs.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Delete,
  Param,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los logs (solo admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.logsService.findAll({ page, limit });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un log por ID (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const log = await this.logsService.remove(id);
    await this.logsService.createLog(
      req.user.id, // userId siempre estará presente porque este endpoint requiere autenticación
      `Eliminó log con ID: ${id}`,
    );
    return log;
  }
}
