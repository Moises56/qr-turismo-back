// src/image-item/image-item.controller.ts
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
import { ImageItemService } from './image-item.service';
import { CreateImageItemDto } from './dto/create-image-item.dto';
import { UpdateImageItemDto } from './dto/update-image-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('image-item')
@Controller('image-item')
export class ImageItemController {
  constructor(
    private readonly imageItemService: ImageItemService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un item de imagen (solo admin)' })
  async create(@Body() createImageItemDto: CreateImageItemDto, @Request() req) {
    const imageItem = await this.imageItemService.create(createImageItemDto);
    await this.logsService.createLog(
      req.user.id,
      `Creó imagen: ${imageItem.name}`,
    );
    return imageItem;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los items de imagen (público)' })
  findAll() {
    return this.imageItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item de imagen por ID (público)' })
  findOne(@Param('id') id: string) {
    return this.imageItemService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un item de imagen (solo admin)' })
  async update(
    @Param('id') id: string,
    @Body() updateImageItemDto: UpdateImageItemDto,
    @Request() req,
  ) {
    const imageItem = await this.imageItemService.update(
      id,
      updateImageItemDto,
    );
    await this.logsService.createLog(
      req.user.id,
      `Actualizó imagen: ${imageItem.name}`,
    );
    return imageItem;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un item de imagen (solo admin)' })
  async remove(@Param('id') id: string, @Request() req) {
    const imageItem = await this.imageItemService.remove(id);
    await this.logsService.createLog(
      req.user.id,
      `Eliminó imagen: ${imageItem.name}`,
    );
    return imageItem;
  }
}
