import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Descuento } from '../catalog/entities/descuento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      User,
      Product,
      Descuento,
    ]),
  ],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
