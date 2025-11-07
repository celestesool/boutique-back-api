import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@ObjectType()
@Entity('order_items')
export class OrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column()
  orderId: string;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Field(() => ID)
  @Column()
  productId: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Field()
  @Column()
  cantidad: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
