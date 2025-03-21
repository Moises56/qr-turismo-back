// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const {
      nombre,
      email,
      password,
      rol = 'usuario',
      empleado = 'sin_numero',
    } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol,
        empleado,
      },
    });

    const tokens = this.generateTokens(user);

    return {
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          empleado: user.empleado,
          createdAt: user.createdAt,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
    };
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret:
          this.configService.get<string>('JWT_SECRET') ||
          'tu_secreto_super_seguro',
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'tu_secreto_refresco_super_seguro',
        expiresIn: '7d',
      }),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    console.log('DESDE-login>', loginDto);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      throw new UnauthorizedException(
        'El correo electrónico no está registrado',
      );
    }
    console.log('Usuario encontrado:', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('¿Contraseña válida?', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Contraseña incorrecta para:', email);
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    const tokens = this.generateTokens(user);
    console.log('Tokens generados:', tokens);

    const response = {
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          empleado: user.empleado,
          createdAt: user.createdAt,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
    };
    console.log('Respuesta generada:', response);
    return response;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'tu_secreto_refresco_super_seguro',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException(
          'El usuario asociado al token no existe',
        );
      }

      const tokens = this.generateTokens(user);

      // Respuesta estructurada consistente
      return {
        status: 'success',
        message: 'Tokens renovados exitosamente',
        data: {
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
        },
      };
    } catch (error) {
      throw new UnauthorizedException(
        'El refresh token es inválido o ha expirado',
      );
    }
  }
}
