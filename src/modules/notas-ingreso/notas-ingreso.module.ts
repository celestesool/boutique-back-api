import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasIngresoService } from './notas-ingreso.service';
import { NotasIngresoResolver } from './notas-ingreso.resolver';
import { NotaIngreso } from './entities/nota-ingreso.entity';
import { DetalleNotaIngreso } from './entities/detalle-nota-ingreso.entity';
import { Product } from '../products/entities/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotaIngreso, DetalleNotaIngreso, Product]),
    AuthModule,
  ],
  providers: [NotasIngresoResolver, NotasIngresoService],
  exports: [NotasIngresoService],
})
export class NotasIngresoModule {}
