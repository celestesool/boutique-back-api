import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
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
import { User } from '../../auth/entities/user.entity';
import { CartItem } from './cart-item.entity';

@ObjectType()
@Entity('carritos')
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (item) => item.carrito, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true, name: 'codigo_descuento' })
  codigoDescuento: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
