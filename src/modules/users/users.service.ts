import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UpdateUserInput, UpdateUserRoleInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Obtener todos los usuarios (solo admin)
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener un usuario por ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  // Actualizar perfil del usuario
  async updateProfile(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    // Verificar si el email ya existe (si se está cambiando)
    if (input.email && input.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ 
        where: { email: input.email } 
      });
      if (existingUser) {
        throw new BadRequestException('El email ya está en uso');
      }
      user.email = input.email;
    }

    // Actualizar nombre si se proporciona
    if (input.nombre) {
      user.nombre = input.nombre;
    }

    // Actualizar contraseña si se proporciona
    if (input.password) {
      user.password = await bcrypt.hash(input.password, 10);
    }

    return this.userRepository.save(user);
  }

  // Cambiar rol de usuario (solo admin)
  async updateRole(id: string, input: UpdateUserRoleInput): Promise<User> {
    const user = await this.findOne(id);
    user.rol = input.rol;
    return this.userRepository.save(user);
  }

  // Eliminar usuario (solo admin)
  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return user;
  }
}
