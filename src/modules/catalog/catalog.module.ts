import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { CatalogResolver } from './catalog.resolver';
import { Categoria } from './entities/categoria.entity';
import { Marca } from './entities/marca.entity';
import { Color } from './entities/color.entity';
import { Talla } from './entities/talla.entity';
import { Descuento } from './entities/descuento.entity';
import { CategoriaColor } from './entities/categoria-color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Categoria,
      Marca,
      Color,
      Talla,
      Descuento,
      CategoriaColor,
    ]),
  ],
  providers: [CatalogService, CatalogResolver],
  exports: [CatalogService],
})
export class CatalogModule {}
