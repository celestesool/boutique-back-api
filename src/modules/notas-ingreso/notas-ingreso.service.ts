import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotaIngreso } from './entities/nota-ingreso.entity';
import { DetalleNotaIngreso } from './entities/detalle-nota-ingreso.entity';
import { CreateNotaIngresoInput } from './dto/create-nota-ingreso.input';
import { UpdateEstadoNotaIngresoInput } from './dto/update-nota-ingreso.input';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class NotasIngresoService {
  constructor(
    @InjectRepository(NotaIngreso)
    private readonly notaIngresoRepository: Repository<NotaIngreso>,
    @InjectRepository(DetalleNotaIngreso)
    private readonly detalleRepository: Repository<DetalleNotaIngreso>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async crearNotaIngreso(
    createNotaIngresoInput: CreateNotaIngresoInput,
    usuario: User,
  ): Promise<NotaIngreso> {
    // Generar número de nota
    const numeroNota = await this.generarNumeroNota();

    // Validar que todos los productos existen
    for (const detalle of createNotaIngresoInput.detalles) {
      const producto = await this.productRepository.findOne({
        where: { id: detalle.productoId },
      });
      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${detalle.productoId} no encontrado`,
        );
      }
    }

    // Calcular total
    let total = 0;
    const detalles = [];

    for (const detalleInput of createNotaIngresoInput.detalles) {
      const subtotal = detalleInput.cantidad * detalleInput.precio_unitario;
      total += subtotal;

      const producto = await this.productRepository.findOne({
        where: { id: detalleInput.productoId },
      });

      const detalle = this.detalleRepository.create({
        producto,
        cantidad: detalleInput.cantidad,
        precio_unitario: detalleInput.precio_unitario,
        subtotal,
        observacion: detalleInput.observacion,
      });

      detalles.push(detalle);
    }

    // Crear nota de ingreso
    const notaIngreso = this.notaIngresoRepository.create({
      numero_nota: numeroNota,
      usuario,
      proveedor: createNotaIngresoInput.proveedor,
      observaciones: createNotaIngresoInput.observaciones,
      total,
      estado: 'pendiente',
      detalles,
    });

    return this.notaIngresoRepository.save(notaIngreso);
  }

  async obtenerNotasIngreso(): Promise<NotaIngreso[]> {
    return this.notaIngresoRepository.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async obtenerNotaIngresoPorId(id: string): Promise<NotaIngreso> {
    const notaIngreso = await this.notaIngresoRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });

    if (!notaIngreso) {
      throw new NotFoundException(`Nota de ingreso con ID ${id} no encontrada`);
    }

    return notaIngreso;
  }

  async actualizarEstado(
    id: string,
    updateEstadoInput: UpdateEstadoNotaIngresoInput,
  ): Promise<NotaIngreso> {
    const notaIngreso = await this.obtenerNotaIngresoPorId(id);

    if (notaIngreso.estado === 'procesada') {
      throw new BadRequestException(
        'No se puede modificar una nota de ingreso ya procesada',
      );
    }

    if (notaIngreso.estado === 'cancelada') {
      throw new BadRequestException(
        'No se puede modificar una nota de ingreso cancelada',
      );
    }

    // Si se está procesando, actualizar el stock
    if (updateEstadoInput.estado === 'procesada') {
      await this.procesarIngreso(notaIngreso);
    }

    notaIngreso.estado = updateEstadoInput.estado;
    return this.notaIngresoRepository.save(notaIngreso);
  }

  async misNotasIngreso(usuario: User): Promise<NotaIngreso[]> {
    return this.notaIngresoRepository.find({
      where: { usuario: { id: usuario.id } },
      relations: ['detalles', 'detalles.producto'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  private async procesarIngreso(notaIngreso: NotaIngreso): Promise<void> {
    // Actualizar stock de productos
    for (const detalle of notaIngreso.detalles) {
      const producto = await this.productRepository.findOne({
        where: { id: detalle.producto.id },
      });

      if (producto) {
        producto.stock = (producto.stock || 0) + detalle.cantidad;
        await this.productRepository.save(producto);
      }
    }
  }

  private async generarNumeroNota(): Promise<string> {
    const año = new Date().getFullYear();
    const count = await this.notaIngresoRepository.count();
    const numero = (count + 1).toString().padStart(4, '0');
    return `NI-${año}-${numero}`;
  }
}
