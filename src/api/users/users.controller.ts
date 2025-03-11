// src/users/users.controller.ts
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
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un usuario (solo admin)' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const result = await this.usersService.create(createUserDto);
    await this.logsService.createLog(
      req.user.id,
      `Creó usuario: ${createUserDto.nombre}`,
    );
    return result;
  }

  @Get()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los usuarios (solo admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un usuario por ID (solo admin)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un usuario (solo admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const result = await this.usersService.update(id, updateUserDto);
    await this.logsService.createLog(
      req.user.id,
      `Actualizó usuario con ID: ${id}`,
    );
    return result;
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un usuario (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.usersService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó usuario con ID: ${id}`,
    );
    return result;
  }

  @Patch(':id/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  async changePassword(
    @Param('id') id: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    if (req.user.id !== id && req.user.rol !== 'admin') {
      throw new UnauthorizedException(
        'No tienes permiso para cambiar esta contraseña',
      );
    }
    const result = await this.usersService.changePassword(
      id,
      oldPassword,
      newPassword,
    );
    await this.logsService.createLog(
      req.user.id,
      `Cambió contraseña del usuario con ID: ${id}`,
    );
    return result;
  }
}
