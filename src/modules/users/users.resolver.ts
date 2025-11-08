import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';
import { UpdateUserInput, UpdateUserRoleInput } from './dto/update-user.input';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Extraer usuario del token
  private extractUserFromContext(context: any): { userId: string; rol: string } {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token);
      return { userId: payload.sub, rol: payload.rol };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  // Verificar si es admin
  private verifyAdmin(rol: string) {
    if (rol !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden acceder a este recurso');
    }
  }

  // Query: Obtener todos los usuarios (solo admin)
  @Query(() => [User], { name: 'usuarios' })
  async getAllUsers(@Context() context): Promise<User[]> {
    const { rol } = this.extractUserFromContext(context);
    this.verifyAdmin(rol);
    return this.usersService.findAll();
  }

  // Query: Obtener todos los usuarios - alias para frontend (solo admin)
  @Query(() => [User], { name: 'obtenerUsuarios' })
  async obtenerUsuarios(@Context() context): Promise<User[]> {
    const { rol } = this.extractUserFromContext(context);
    this.verifyAdmin(rol);
    return this.usersService.findAll();
  }

  // Query: Obtener un usuario por ID (admin o el propio usuario)
  @Query(() => User, { name: 'usuario' })
  async getUser(
    @Args('id', { type: () => ID }) id: string,
    @Context() context,
  ): Promise<User> {
    const { userId, rol } = this.extractUserFromContext(context);
    
    // Solo admin o el mismo usuario puede ver su perfil
    if (rol !== 'admin' && userId !== id) {
      throw new ForbiddenException('No tienes permiso para ver este usuario');
    }

    return this.usersService.findOne(id);
  }

  // Query: Obtener perfil del usuario autenticado
  @Query(() => User, { name: 'miPerfil' })
  async getMyProfile(@Context() context): Promise<User> {
    const { userId } = this.extractUserFromContext(context);
    return this.usersService.findOne(userId);
  }

  // Mutation: Actualizar perfil propio
  @Mutation(() => User)
  async actualizarPerfil(
    @Args('input') input: UpdateUserInput,
    @Context() context,
  ): Promise<User> {
    const { userId } = this.extractUserFromContext(context);
    return this.usersService.updateProfile(userId, input);
  }

  // Mutation: Actualizar perfil de otro usuario (solo admin)
  @Mutation(() => User)
  async actualizarUsuario(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
    @Context() context,
  ): Promise<User> {
    const { rol } = this.extractUserFromContext(context);
    this.verifyAdmin(rol);
    return this.usersService.updateProfile(id, input);
  }

  // Mutation: Cambiar rol de usuario (solo admin)
  @Mutation(() => User)
  async cambiarRolUsuario(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserRoleInput,
    @Context() context,
  ): Promise<User> {
    const { rol } = this.extractUserFromContext(context);
    this.verifyAdmin(rol);
    return this.usersService.updateRole(id, input);
  }

  // Mutation: Asignar rol a usuario (alias para frontend - solo admin)
  @Mutation(() => User, { name: 'asignarRoles' })
  async asignarRoles(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserRoleInput,
    @Context() context,
  ): Promise<User> {
    const { rol } = this.extractUserFromContext(context);
    this.verifyAdmin(rol);
    return this.usersService.updateRole(id, input);
  }

  // Mutation: Eliminar usuario (solo admin)
  @Mutation(() => User)
  async eliminarUsuario(
    @Args('id', { type: () => ID }) id: string,
    @Context() context,
  ): Promise<User> {
    const { rol } = this.extractUserFromContext(context);
    this.verifyAdmin(rol);
    return this.usersService.remove(id);
  }
}
