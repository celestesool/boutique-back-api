import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

@ObjectType()
@Entity('orders')
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  impuestos: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  envio: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE,
  })
  estado: OrderStatus;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  numeroSeguimiento?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
