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
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { SuscripcionLocalService } from './suscripcion-local.service';
import { CreateSuscripcionLocalDto } from './dto/create-suscripcion-local.dto';
import { UpdateSuscripcionLocalDto } from './dto/update-suscripcion-local.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('api/suscripcion-local')
export class SuscripcionLocalController {
  constructor(
    private readonly suscripcionLocalService: SuscripcionLocalService,
  ) {}

  @Post()
  async create(@Body() createSuscripcionLocalDto: CreateSuscripcionLocalDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Suscripción de local creada exitosamente',
      data: await this.suscripcionLocalService.create(
        createSuscripcionLocalDto,
      ),
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Suscripciones de locales obtenidas exitosamente',
      ...(await this.suscripcionLocalService.findAll({ page, limit, status })),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Suscripción de local obtenida exitosamente',
      data: await this.suscripcionLocalService.findOne(id),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSuscripcionLocalDto: UpdateSuscripcionLocalDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Suscripción de local actualizada exitosamente',
      data: await this.suscripcionLocalService.update(
        id,
        updateSuscripcionLocalDto,
      ),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.suscripcionLocalService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Suscripción de local eliminada exitosamente',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'turismo')
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      throw new BadRequestException(
        'Estado no válido. Debe ser: pending, approved o rejected',
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: `Estado de la suscripción actualizado a ${status}`,
      data: await this.suscripcionLocalService.updateStatus(
        id,
        status as 'pending' | 'approved' | 'rejected',
      ),
    };
  }
}
