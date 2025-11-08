import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { NotaVenta, EstadoNotaVenta } from '../notas-venta/entities/nota-venta.entity';
import { DetalleNotaVenta } from '../notas-venta/entities/detalle-nota-venta.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import {
  ReporteVentas,
  ReporteInventario,
  ProductoMasVendido,
  UsuarioActivo,
  ProductoBajoStock,
  VentaPorFecha,
  ReporteGeneral,
} from './types/reportes.types';
import { ReporteFechasInput, TopProductosInput } from './dto/reportes.input';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(NotaVenta)
    private readonly notaVentaRepository: Repository<NotaVenta>,
    @InjectRepository(DetalleNotaVenta)
    private readonly detalleVentaRepository: Repository<DetalleNotaVenta>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Reporte de ventas
  async reporteVentas(input?: ReporteFechasInput): Promise<ReporteVentas> {
    let where: any = {};

    if (input?.fechaInicio && input?.fechaFin) {
      where.createdAt = Between(
        new Date(input.fechaInicio),
        new Date(input.fechaFin),
      );
    }

    const ventas = await this.notaVentaRepository.find({ where });

    const procesadas = ventas.filter(
      (v) => v.estado === EstadoNotaVenta.PROCESADA,
    );
    const pendientes = ventas.filter(
      (v) => v.estado === EstadoNotaVenta.PENDIENTE,
    );
    const canceladas = ventas.filter(
      (v) => v.estado === EstadoNotaVenta.CANCELADA,
    );

    const montoTotal = procesadas.reduce(
      (sum, venta) => sum + Number(venta.total),
      0,
    );

    return {
      totalVentas: ventas.length,
      montoTotal,
      promedioVenta: ventas.length > 0 ? montoTotal / procesadas.length : 0,
      ventasProcesadas: procesadas.length,
      ventasPendientes: pendientes.length,
      ventasCanceladas: canceladas.length,
    };
  }

  // Productos más vendidos
  async productosMasVendidos(input?: TopProductosInput): Promise<ProductoMasVendido[]> {
    const limite = input?.limite || 10;

    const detalles = await this.detalleVentaRepository
      .createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .leftJoinAndSelect('detalle.notaVenta', 'notaVenta')
      .where('notaVenta.estado = :estado', { estado: EstadoNotaVenta.PROCESADA })
      .getMany();

    // Agrupar por producto
    const ventasPorProducto = new Map<string, { producto: Product; cantidadVendida: number; montoTotal: number }>();

    detalles.forEach((detalle) => {
      const productoId = detalle.producto.id;
      if (ventasPorProducto.has(productoId)) {
        const existing = ventasPorProducto.get(productoId)!;
        existing.cantidadVendida += detalle.cantidad;
        existing.montoTotal += Number(detalle.subtotal);
      } else {
        ventasPorProducto.set(productoId, {
          producto: detalle.producto,
          cantidadVendida: detalle.cantidad,
          montoTotal: Number(detalle.subtotal),
        });
      }
    });

    // Convertir a array y ordenar
    return Array.from(ventasPorProducto.values())
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, limite);
  }

  // Usuarios más activos
  async usuariosMasActivos(input?: TopProductosInput): Promise<UsuarioActivo[]> {
    const limite = input?.limite || 10;

    const ventas = await this.notaVentaRepository.find({
      where: { estado: EstadoNotaVenta.PROCESADA },
      relations: ['usuario'],
    });

    // Agrupar por usuario
    const ventasPorUsuario = new Map<string, { usuario: User; totalCompras: number; montoTotal: number }>();

    ventas.forEach((venta) => {
      const usuarioId = venta.usuario.id;
      if (ventasPorUsuario.has(usuarioId)) {
        const existing = ventasPorUsuario.get(usuarioId)!;
        existing.totalCompras += 1;
        existing.montoTotal += Number(venta.total);
      } else {
        ventasPorUsuario.set(usuarioId, {
          usuario: venta.usuario,
          totalCompras: 1,
          montoTotal: Number(venta.total),
        });
      }
    });

    // Convertir a array y ordenar
    return Array.from(ventasPorUsuario.values())
      .sort((a, b) => b.montoTotal - a.montoTotal)
      .slice(0, limite);
  }

  // Productos con bajo stock
  async productosBajoStock(stockMinimo: number = 10): Promise<ProductoBajoStock[]> {
    const productos = await this.productRepository.find({
      where: { activo: true },
    });

    return productos
      .filter((p) => p.stock < stockMinimo)
      .map((producto) => ({
        producto,
        stockActual: producto.stock,
        stockMinimo,
      }))
      .sort((a, b) => a.stockActual - b.stockActual);
  }

  // Reporte de inventario
  async reporteInventario(): Promise<ReporteInventario> {
    const productos = await this.productRepository.find();

    const activos = productos.filter((p) => p.activo);
    const inactivos = productos.filter((p) => !p.activo);
    const sinStock = productos.filter((p) => p.stock === 0);
    const bajoStock = productos.filter((p) => p.stock > 0 && p.stock < 10);

    const valorTotal = productos.reduce(
      (sum, p) => sum + p.stock * Number(p.precio),
      0,
    );

    return {
      totalProductos: productos.length,
      productosActivos: activos.length,
      productosInactivos: inactivos.length,
      productosSinStock: sinStock.length,
      productosBajoStock: bajoStock.length,
      valorTotalInventario: valorTotal,
    };
  }

  // Ventas por fecha
  async ventasPorFecha(input?: ReporteFechasInput): Promise<VentaPorFecha[]> {
    let where: any = { estado: EstadoNotaVenta.PROCESADA };

    if (input?.fechaInicio && input?.fechaFin) {
      where.createdAt = Between(
        new Date(input.fechaInicio),
        new Date(input.fechaFin),
      );
    } else {
      // Por defecto, últimos 30 días
      const fechaFin = new Date();
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 30);
      where.createdAt = Between(fechaInicio, fechaFin);
    }

    const ventas = await this.notaVentaRepository.find({ where });

    // Agrupar por fecha
    const ventasPorDia = new Map<string, { cantidadVentas: number; montoTotal: number }>();

    ventas.forEach((venta) => {
      const fecha = venta.createdAt.toISOString().split('T')[0];
      if (ventasPorDia.has(fecha)) {
        const existing = ventasPorDia.get(fecha)!;
        existing.cantidadVentas += 1;
        existing.montoTotal += Number(venta.total);
      } else {
        ventasPorDia.set(fecha, {
          cantidadVentas: 1,
          montoTotal: Number(venta.total),
        });
      }
    });

    // Convertir a array y ordenar por fecha
    return Array.from(ventasPorDia.entries())
      .map(([fecha, datos]) => ({
        fecha,
        cantidadVentas: datos.cantidadVentas,
        montoTotal: datos.montoTotal,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  // Reporte general (dashboard)
  async reporteGeneral(): Promise<ReporteGeneral> {
    const [ventas, inventario, productosMasVendidos, usuariosMasActivos, productosBajoStock] = await Promise.all([
      this.reporteVentas(),
      this.reporteInventario(),
      this.productosMasVendidos({ limite: 5 }),
      this.usuariosMasActivos({ limite: 5 }),
      this.productosBajoStock(10),
    ]);

    return {
      ventas,
      inventario,
      productosMasVendidos,
      usuariosMasActivos,
      productosBajoStock: productosBajoStock.slice(0, 5),
    };
  }

  // Ventas del día
  async ventasDelDia(): Promise<ReporteVentas> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    return this.reporteVentas({
      fechaInicio: hoy.toISOString(),
      fechaFin: manana.toISOString(),
    });
  }

  // Ventas del mes
  async ventasDelMes(): Promise<ReporteVentas> {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59);

    return this.reporteVentas({
      fechaInicio: primerDia.toISOString(),
      fechaFin: ultimoDia.toISOString(),
    });
  }

  // Ventas del año
  async ventasDelAnio(): Promise<ReporteVentas> {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), 0, 1);
    const ultimoDia = new Date(hoy.getFullYear(), 11, 31, 23, 59, 59);

    return this.reporteVentas({
      fechaInicio: primerDia.toISOString(),
      fechaFin: ultimoDia.toISOString(),
    });
  }
}
