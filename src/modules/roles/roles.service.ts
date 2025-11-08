import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { CreateRolInput, UpdateRolInput } from './dto/rol.input';
import { CreatePermisoInput, UpdatePermisoInput } from './dto/permiso.input';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  // ==================== ROLES ====================
  async obtenerRoles(): Promise<Rol[]> {
    return this.rolRepository.find({
      relations: ['permisos'],
      order: { nombre: 'ASC' },
    });
  }

  async obtenerRolPorId(id: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id },
      relations: ['permisos'],
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  async crearRol(createRolInput: CreateRolInput): Promise<Rol> {
    // Verificar si el rol ya existe
    const existe = await this.rolRepository.findOne({
      where: { nombre: createRolInput.nombre },
    });

    if (existe) {
      throw new BadRequestException(`El rol "${createRolInput.nombre}" ya existe`);
    }

    let permisos: Permiso[] = [];

    // Si se proporcionaron permisos, buscarlos
    if (createRolInput.permisosIds && createRolInput.permisosIds.length > 0) {
      permisos = await this.permisoRepository.find({
        where: { id: In(createRolInput.permisosIds) },
      });

      if (permisos.length !== createRolInput.permisosIds.length) {
        throw new NotFoundException('Algunos permisos no fueron encontrados');
      }
    }

    const rol = this.rolRepository.create({
      nombre: createRolInput.nombre,
      descripcion: createRolInput.descripcion,
      permisos,
    });

    return this.rolRepository.save(rol);
  }

  async actualizarRol(id: string, updateRolInput: UpdateRolInput): Promise<Rol> {
    const rol = await this.obtenerRolPorId(id);

    if (updateRolInput.nombre) {
      // Verificar si el nuevo nombre ya existe en otro rol
      const existe = await this.rolRepository.findOne({
        where: { nombre: updateRolInput.nombre },
      });

      if (existe && existe.id !== id) {
        throw new BadRequestException(`El rol "${updateRolInput.nombre}" ya existe`);
      }

      rol.nombre = updateRolInput.nombre;
    }

    if (updateRolInput.descripcion !== undefined) {
      rol.descripcion = updateRolInput.descripcion;
    }

    if (updateRolInput.permisosIds) {
      const permisos = await this.permisoRepository.find({
        where: { id: In(updateRolInput.permisosIds) },
      });

      if (permisos.length !== updateRolInput.permisosIds.length) {
        throw new NotFoundException('Algunos permisos no fueron encontrados');
      }

      rol.permisos = permisos;
    }

    return this.rolRepository.save(rol);
  }

  async eliminarRol(id: string): Promise<boolean> {
    const rol = await this.obtenerRolPorId(id);

    // Validar que no sea un rol del sistema
    if (['admin', 'cliente', 'vendedor'].includes(rol.nombre.toLowerCase())) {
      throw new BadRequestException('No se pueden eliminar roles del sistema');
    }

    await this.rolRepository.remove(rol);
    return true;
  }

  // ==================== PERMISOS ====================
  async obtenerPermisos(): Promise<Permiso[]> {
    return this.permisoRepository.find({
      order: { modulo: 'ASC', nombre: 'ASC' },
    });
  }

  async obtenerPermisoPorId(id: string): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    return permiso;
  }

  async crearPermiso(createPermisoInput: CreatePermisoInput): Promise<Permiso> {
    // Verificar si el código ya existe
    const existe = await this.permisoRepository.findOne({
      where: { codigo: createPermisoInput.codigo },
    });

    if (existe) {
      throw new BadRequestException(
        `El permiso con código "${createPermisoInput.codigo}" ya existe`,
      );
    }

    const permiso = this.permisoRepository.create(createPermisoInput);
    return this.permisoRepository.save(permiso);
  }

  async actualizarPermiso(
    id: string,
    updatePermisoInput: UpdatePermisoInput,
  ): Promise<Permiso> {
    const permiso = await this.obtenerPermisoPorId(id);

    if (updatePermisoInput.nombre !== undefined) {
      permiso.nombre = updatePermisoInput.nombre;
    }

    if (updatePermisoInput.descripcion !== undefined) {
      permiso.descripcion = updatePermisoInput.descripcion;
    }

    if (updatePermisoInput.modulo !== undefined) {
      permiso.modulo = updatePermisoInput.modulo;
    }

    return this.permisoRepository.save(permiso);
  }

  async eliminarPermiso(id: string): Promise<boolean> {
    const permiso = await this.obtenerPermisoPorId(id);
    await this.permisoRepository.remove(permiso);
    return true;
  }

  // ==================== UTILIDADES ====================
  async inicializarPermisosBasicos(): Promise<void> {
    const permisos = [
      // Productos
      { nombre: 'Crear Producto', codigo: 'crear_producto', modulo: 'productos' },
      { nombre: 'Editar Producto', codigo: 'editar_producto', modulo: 'productos' },
      { nombre: 'Eliminar Producto', codigo: 'eliminar_producto', modulo: 'productos' },
      { nombre: 'Ver Productos', codigo: 'ver_productos', modulo: 'productos' },
      
      // Usuarios
      { nombre: 'Crear Usuario', codigo: 'crear_usuario', modulo: 'usuarios' },
      { nombre: 'Editar Usuario', codigo: 'editar_usuario', modulo: 'usuarios' },
      { nombre: 'Eliminar Usuario', codigo: 'eliminar_usuario', modulo: 'usuarios' },
      { nombre: 'Ver Usuarios', codigo: 'ver_usuarios', modulo: 'usuarios' },
      
      // Ordenes
      { nombre: 'Crear Orden', codigo: 'crear_orden', modulo: 'ordenes' },
      { nombre: 'Ver Ordenes', codigo: 'ver_ordenes', modulo: 'ordenes' },
      { nombre: 'Actualizar Orden', codigo: 'actualizar_orden', modulo: 'ordenes' },
      
      // Inventario
      { nombre: 'Gestionar Inventario', codigo: 'gestionar_inventario', modulo: 'inventario' },
      { nombre: 'Ver Inventario', codigo: 'ver_inventario', modulo: 'inventario' },
    ];

    for (const permisoData of permisos) {
      const existe = await this.permisoRepository.findOne({
        where: { codigo: permisoData.codigo },
      });

      if (!existe) {
        const permiso = this.permisoRepository.create(permisoData);
        await this.permisoRepository.save(permiso);
      }
    }
  }
}
