import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Rol } from '../../roles/entities/rol.entity';

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

  @Field({ nullable: true })
  @Column({ default: 'cliente', nullable: true })
  rolNombre: string; // Mantener por compatibilidad, deprecated

  @Field(() => Rol, { nullable: true })
  @ManyToOne(() => Rol, { eager: true, nullable: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

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
