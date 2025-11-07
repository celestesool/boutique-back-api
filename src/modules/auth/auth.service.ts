import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    // Verificar si usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: input.email },
    });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Crear usuario
    const user = this.userRepository.create({
      email: input.email,
      nombre: input.nombre,
      password: hashedPassword,
      rol: 'cliente',
      activo: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Generar token JWT
    const token = this.jwtService.sign(
      { sub: savedUser.id, email: savedUser.email },
      { expiresIn: '7d' },
    );

    return {
      accessToken: token,
      user: savedUser,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    // Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // Generar token JWT
    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    return {
      accessToken: token,
      user,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }
}
