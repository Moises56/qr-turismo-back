// src/api/users/users.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });

    // Respuesta estructurada
    return {
      status: 'success',
      message: 'Usuario creado exitosamente',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          empleado: user.empleado,
          createdAt: user.createdAt,
        },
      },
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        empleado: true,
      },
    });
    return {
      status: 'success',
      message: 'Usuarios obtenidos exitosamente',
      data: { users },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return {
      status: 'success',
      message: 'Usuario obtenido exitosamente',
      data: { user },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Verifica que el usuario exista
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return {
      status: 'success',
      message: 'Usuario actualizado exitosamente',
      data: { user },
    };
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica que el usuario exista
    const user = await this.prisma.user.delete({ where: { id } });
    return {
      status: 'success',
      message: 'Usuario eliminado exitosamente',
      data: { user },
    };
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new ForbiddenException('Contraseña antigua incorrecta');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return {
      status: 'success',
      message: 'Contraseña cambiada exitosamente',
      data: { user: updatedUser },
    };
  }
}
