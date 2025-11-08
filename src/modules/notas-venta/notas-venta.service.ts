import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotaVenta, EstadoNotaVenta } from './entities/nota-venta.entity';
import { DetalleNotaVenta } from './entities/detalle-nota-venta.entity';
import { CreateNotaVentaInput } from './dto/create-nota-venta.input';
import { UpdateNotaVentaInput } from './dto/update-nota-venta.input';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class NotasVentaService {
  constructor(
    @InjectRepository(NotaVenta)
    private readonly notaVentaRepository: Repository<NotaVenta>,
    @InjectRepository(DetalleNotaVenta)
    private readonly detalleRepository: Repository<DetalleNotaVenta>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Generar número de nota de venta automático
  private async generarNumeroNota(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `NV-${year}-`;

    // Buscar la última nota de venta del año
    const lastNota = await this.notaVentaRepository
      .createQueryBuilder('nota')
      .where('nota.numero LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('nota.numero', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastNota) {
      const lastNumber = parseInt(lastNota.numero.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  // Crear nota de venta
  async crearNotaVenta(input: CreateNotaVentaInput): Promise<NotaVenta> {
    // Validar usuario
    const usuario = await this.userRepository.findOne({
      where: { id: input.usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar orden si se proporciona
    let orden = null;
    if (input.ordenId) {
      orden = await this.orderRepository.findOne({
        where: { id: input.ordenId },
      });
      if (!orden) {
        throw new NotFoundException('Orden no encontrada');
      }
    }

    // Validar productos y calcular total
    let total = 0;
    const detalles: DetalleNotaVenta[] = [];

    for (const detalleInput of input.detalles) {
      const producto = await this.productRepository.findOne({
        where: { id: detalleInput.productoId },
      });

      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${detalleInput.productoId} no encontrado`,
        );
      }

      // Verificar stock disponible
      if (producto.stock < detalleInput.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${producto.nombre}. Disponible: ${producto.stock}`,
        );
      }

      const subtotal = detalleInput.cantidad * detalleInput.precioUnitario;
      total += subtotal;

      const detalle = this.detalleRepository.create({
        producto,
        cantidad: detalleInput.cantidad,
        precioUnitario: detalleInput.precioUnitario,
        subtotal,
      });

      detalles.push(detalle);
    }

    // Generar número de nota
    const numero = await this.generarNumeroNota();

    // Crear nota de venta
    const notaVenta = this.notaVentaRepository.create({
      numero,
      usuario,
      orden,
      detalles,
      total,
      estado: EstadoNotaVenta.PENDIENTE,
      observaciones: input.observaciones,
    });

    return this.notaVentaRepository.save(notaVenta);
  }

  // Obtener todas las notas de venta
  async findAll(): Promise<NotaVenta[]> {
    return this.notaVentaRepository.find({
      relations: ['usuario', 'orden', 'detalles', 'detalles.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener una nota de venta por ID
  async findOne(id: string): Promise<NotaVenta> {
    const notaVenta = await this.notaVentaRepository.findOne({
      where: { id },
      relations: ['usuario', 'orden', 'detalles', 'detalles.producto'],
    });

    if (!notaVenta) {
      throw new NotFoundException('Nota de venta no encontrada');
    }

    return notaVenta;
  }

  // Obtener notas de venta por usuario
  async findByUsuario(usuarioId: string): Promise<NotaVenta[]> {
    return this.notaVentaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'orden', 'detalles', 'detalles.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  // Actualizar estado de nota de venta
  async actualizarEstado(
    id: string,
    input: UpdateNotaVentaInput,
  ): Promise<NotaVenta> {
    const notaVenta = await this.findOne(id);

    // Validar que no se pueda modificar si ya está procesada o cancelada
    if (
      notaVenta.estado === EstadoNotaVenta.PROCESADA ||
      notaVenta.estado === EstadoNotaVenta.CANCELADA
    ) {
      throw new BadRequestException(
        `No se puede modificar una nota de venta ${notaVenta.estado}`,
      );
    }

    // Si se está procesando la venta, descontar del stock
    if (input.estado === EstadoNotaVenta.PROCESADA) {
      await this.procesarVenta(notaVenta);
    }

    // Actualizar estado y observaciones
    if (input.estado) {
      notaVenta.estado = input.estado;
    }
    if (input.observaciones !== undefined) {
      notaVenta.observaciones = input.observaciones;
    }

    return this.notaVentaRepository.save(notaVenta);
  }

  // Procesar venta (descontar stock)
  private async procesarVenta(notaVenta: NotaVenta): Promise<void> {
    for (const detalle of notaVenta.detalles) {
      const producto = detalle.producto;

      // Verificar stock nuevamente
      if (producto.stock < detalle.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${producto.nombre}`,
        );
      }

      // Descontar stock
      producto.stock -= detalle.cantidad;
      await this.productRepository.save(producto);
    }
  }

  // Cancelar nota de venta
  async cancelarNotaVenta(id: string): Promise<NotaVenta> {
    return this.actualizarEstado(id, {
      estado: EstadoNotaVenta.CANCELADA,
    });
  }

  // Eliminar nota de venta (solo si está pendiente)
  async remove(id: string): Promise<NotaVenta> {
    const notaVenta = await this.findOne(id);

    if (notaVenta.estado !== EstadoNotaVenta.PENDIENTE) {
      throw new BadRequestException(
        'Solo se pueden eliminar notas de venta en estado pendiente',
      );
    }

    await this.notaVentaRepository.remove(notaVenta);
    return notaVenta;
  }

  // Obtener estadísticas de ventas
  async obtenerEstadisticas(): Promise<{
    totalVentas: number;
    ventasProcesadas: number;
    ventasPendientes: number;
    ventasCanceladas: number;
    montoTotal: number;
  }> {
    const todas = await this.notaVentaRepository.find();

    const procesadas = todas.filter(
      (n) => n.estado === EstadoNotaVenta.PROCESADA,
    );
    const pendientes = todas.filter(
      (n) => n.estado === EstadoNotaVenta.PENDIENTE,
    );
    const canceladas = todas.filter(
      (n) => n.estado === EstadoNotaVenta.CANCELADA,
    );

    const montoTotal = procesadas.reduce(
      (sum, nota) => sum + Number(nota.total),
      0,
    );

    return {
      totalVentas: todas.length,
      ventasProcesadas: procesadas.length,
      ventasPendientes: pendientes.length,
      ventasCanceladas: canceladas.length,
      montoTotal,
    };
  }
}
