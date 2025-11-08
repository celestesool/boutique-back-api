import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NotaVenta } from './nota-venta.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('detalle_nota_venta')
export class DetalleNotaVenta {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => NotaVenta)
  @ManyToOne(() => NotaVenta, (notaVenta) => notaVenta.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nota_venta_id' })
  notaVenta: NotaVenta;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Product;

  @Field(() => Int)
  @Column({ type: 'int' })
  cantidad: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
