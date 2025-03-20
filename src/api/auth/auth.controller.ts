// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express'; // Importa el tipo Request

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: 'some_object_id',
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            rol: 'usuario',
            empleado: 'EMP013',
            createdAt: '2025-03-11T01:23:27.901Z',
          },
          tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    },
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        status: 'success',
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: 'some_object_id',
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            rol: 'usuario',
            empleado: 'EMP013',
            createdAt: '2025-03-11T01:23:27.901Z',
          },
          tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'El correo electrónico no está registrado o la contraseña es incorrecta',
  })
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    console.log('Solicitud recibida en /auth/login');
    console.log('Origen:', req.headers.origin);
    console.log('Cuerpo:', loginDto);
    console.log('Cookies:', req.headers.cookie);
    console.log('Authorization:', req.headers.authorization);
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
