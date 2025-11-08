import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('cart_items')
export class CartItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carrito_id' })
  carrito: Cart;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Product;

  @Field(() => Int)
  @Column({ type: 'int' })
  cantidad: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
