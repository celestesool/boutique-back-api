import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ReportesService } from './reportes.service';
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

@Resolver()
export class ReportesResolver {
  constructor(private readonly reportesService: ReportesService) {}

  // Reporte general de dashboard
  @Query(() => ReporteGeneral, { name: 'reporteGeneral', description: 'Reporte general para dashboard' })
  async reporteGeneral(): Promise<ReporteGeneral> {
    return this.reportesService.reporteGeneral();
  }

  // Reporte de ventas
  @Query(() => ReporteVentas, { name: 'reporteVentas', description: 'Reporte de ventas por rango de fechas' })
  async reporteVentas(
    @Args('input', { nullable: true }) input?: ReporteFechasInput,
  ): Promise<ReporteVentas> {
    return this.reportesService.reporteVentas(input);
  }

  // Ventas del día
  @Query(() => ReporteVentas, { name: 'ventasDelDia', description: 'Reporte de ventas del día actual' })
  async ventasDelDia(): Promise<ReporteVentas> {
    return this.reportesService.ventasDelDia();
  }

  // Ventas del mes
  @Query(() => ReporteVentas, { name: 'ventasDelMes', description: 'Reporte de ventas del mes actual' })
  async ventasDelMes(): Promise<ReporteVentas> {
    return this.reportesService.ventasDelMes();
  }

  // Ventas del año
  @Query(() => ReporteVentas, { name: 'ventasDelAnio', description: 'Reporte de ventas del año actual' })
  async ventasDelAnio(): Promise<ReporteVentas> {
    return this.reportesService.ventasDelAnio();
  }

  // Productos más vendidos
  @Query(() => [ProductoMasVendido], { name: 'productosMasVendidos', description: 'Top productos más vendidos' })
  async productosMasVendidos(
    @Args('input', { nullable: true }) input?: TopProductosInput,
  ): Promise<ProductoMasVendido[]> {
    return this.reportesService.productosMasVendidos(input);
  }

  // Usuarios más activos
  @Query(() => [UsuarioActivo], { name: 'usuariosMasActivos', description: 'Top usuarios más activos' })
  async usuariosMasActivos(
    @Args('input', { nullable: true }) input?: TopProductosInput,
  ): Promise<UsuarioActivo[]> {
    return this.reportesService.usuariosMasActivos(input);
  }

  // Productos con bajo stock
  @Query(() => [ProductoBajoStock], { name: 'productosBajoStock', description: 'Productos con stock bajo' })
  async productosBajoStock(
    @Args('stockMinimo', { type: () => Int, nullable: true, defaultValue: 10 }) stockMinimo?: number,
  ): Promise<ProductoBajoStock[]> {
    return this.reportesService.productosBajoStock(stockMinimo);
  }

  // Reporte de inventario
  @Query(() => ReporteInventario, { name: 'reporteInventario', description: 'Reporte completo de inventario' })
  async reporteInventario(): Promise<ReporteInventario> {
    return this.reportesService.reporteInventario();
  }

  // Ventas por fecha
  @Query(() => [VentaPorFecha], { name: 'ventasPorFecha', description: 'Ventas agrupadas por fecha' })
  async ventasPorFecha(
    @Args('input', { nullable: true }) input?: ReporteFechasInput,
  ): Promise<VentaPorFecha[]> {
    return this.reportesService.ventasPorFecha(input);
  }
}
