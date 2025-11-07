import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
    AuthModule,
  ],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
