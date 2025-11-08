import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesResolver } from './reportes.resolver';
import { NotaVenta } from '../notas-venta/entities/nota-venta.entity';
import { DetalleNotaVenta } from '../notas-venta/entities/detalle-nota-venta.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotaVenta,
      DetalleNotaVenta,
      Product,
      User,
      Order,
    ]),
  ],
  providers: [ReportesService, ReportesResolver],
  exports: [ReportesService],
})
export class ReportesModule {}
