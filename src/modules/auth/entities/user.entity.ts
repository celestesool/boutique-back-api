import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  nombre: string;

  // ⚠️ NO expongas password en GraphQL
  @Column()
  password: string;

  @Field()
  @Column({ default: 'cliente' })
  rol: string; // 'admin', 'cliente', 'vendedor'

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}
