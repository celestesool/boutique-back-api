import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasVentaService } from './notas-venta.service';
import { NotasVentaResolver } from './notas-venta.resolver';
import { NotaVenta } from './entities/nota-venta.entity';
import { DetalleNotaVenta } from './entities/detalle-nota-venta.entity';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotaVenta,
      DetalleNotaVenta,
      User,
      Product,
      Order,
    ]),
  ],
  providers: [NotasVentaService, NotasVentaResolver],
  exports: [NotasVentaService],
})
export class NotasVentaModule {}
