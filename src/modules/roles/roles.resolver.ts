import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { CreateRolInput, UpdateRolInput } from './dto/rol.input';
import { CreatePermisoInput, UpdatePermisoInput } from './dto/permiso.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Rol)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  // ==================== ROLES ====================
  @Query(() => [Rol], { name: 'obtenerRoles' })
  @UseGuards(JwtAuthGuard)
  async obtenerRoles(): Promise<Rol[]> {
    return this.rolesService.obtenerRoles();
  }

  @Query(() => Rol, { name: 'obtenerRolPorId' })
  @UseGuards(JwtAuthGuard)
  async obtenerRolPorId(@Args('id', { type: () => ID }) id: string): Promise<Rol> {
    return this.rolesService.obtenerRolPorId(id);
  }

  @Mutation(() => Rol, { name: 'crearRol' })
  @UseGuards(JwtAuthGuard)
  async crearRol(@Args('input') input: CreateRolInput): Promise<Rol> {
    return this.rolesService.crearRol(input);
  }

  @Mutation(() => Rol, { name: 'actualizarRol' })
  @UseGuards(JwtAuthGuard)
  async actualizarRol(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateRolInput,
  ): Promise<Rol> {
    return this.rolesService.actualizarRol(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarRol' })
  @UseGuards(JwtAuthGuard)
  async eliminarRol(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.rolesService.eliminarRol(id);
  }

  // ==================== PERMISOS ====================
  @Query(() => [Permiso], { name: 'obtenerPermisos' })
  @UseGuards(JwtAuthGuard)
  async obtenerPermisos(): Promise<Permiso[]> {
    return this.rolesService.obtenerPermisos();
  }

  @Query(() => Permiso, { name: 'obtenerPermisoPorId' })
  @UseGuards(JwtAuthGuard)
  async obtenerPermisoPorId(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Permiso> {
    return this.rolesService.obtenerPermisoPorId(id);
  }

  @Mutation(() => Permiso, { name: 'crearPermiso' })
  @UseGuards(JwtAuthGuard)
  async crearPermiso(@Args('input') input: CreatePermisoInput): Promise<Permiso> {
    return this.rolesService.crearPermiso(input);
  }

  @Mutation(() => Permiso, { name: 'actualizarPermiso' })
  @UseGuards(JwtAuthGuard)
  async actualizarPermiso(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePermisoInput,
  ): Promise<Permiso> {
    return this.rolesService.actualizarPermiso(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarPermiso' })
  @UseGuards(JwtAuthGuard)
  async eliminarPermiso(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.rolesService.eliminarPermiso(id);
  }

  @Mutation(() => Boolean, { name: 'inicializarPermisos' })
  @UseGuards(JwtAuthGuard)
  async inicializarPermisos(): Promise<boolean> {
    await this.rolesService.inicializarPermisosBasicos();
    return true;
  }
}
