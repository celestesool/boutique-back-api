import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Product } from './entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { MLModule } from '../../ml/ml.module';
import { Categoria } from '../catalog/entities/categoria.entity';
import { Marca } from '../catalog/entities/marca.entity';
import { Descuento } from '../catalog/entities/descuento.entity';
import { Color } from '../catalog/entities/color.entity';
import { Talla } from '../catalog/entities/talla.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Categoria, Marca, Descuento, Color, Talla]),
    AuthModule,
    MLModule,
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService],
})
export class ProductsModule {}


