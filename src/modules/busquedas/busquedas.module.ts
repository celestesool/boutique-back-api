import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusquedasService } from './busquedas.service';
import { BusquedasResolver } from './busquedas.resolver';
import { Busqueda } from './entities/busqueda.entity';
import { Product } from '../products/entities/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Busqueda, Product]),
    AuthModule,
  ],
  providers: [BusquedasResolver, BusquedasService],
  exports: [BusquedasService],
})
export class BusquedasModule {}
