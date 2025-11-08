import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NotaIngreso } from './nota-ingreso.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('detalles_nota_ingreso')
export class DetalleNotaIngreso {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => NotaIngreso)
  @ManyToOne(() => NotaIngreso, (nota) => nota.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nota_ingreso_id' })
  notaIngreso: NotaIngreso;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Product;

  @Field(() => Int)
  @Column({ type: 'int' })
  cantidad: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  observacion: string;
}
