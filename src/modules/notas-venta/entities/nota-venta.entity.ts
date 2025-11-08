import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
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
import { Order } from '../../orders/entities/order.entity';
import { DetalleNotaVenta } from './detalle-nota-venta.entity';

export enum EstadoNotaVenta {
  PENDIENTE = 'pendiente',
  PROCESADA = 'procesada',
  CANCELADA = 'cancelada',
}

registerEnumType(EstadoNotaVenta, {
  name: 'EstadoNotaVenta',
  description: 'Estados posibles de una nota de venta',
});

@ObjectType()
@Entity('notas_venta')
export class NotaVenta {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  numero: string; // NV-2025-0001

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, { nullable: true, eager: true })
  @JoinColumn({ name: 'orden_id' })
  orden: Order;

  @Field(() => [DetalleNotaVenta])
  @OneToMany(() => DetalleNotaVenta, (detalle) => detalle.notaVenta, {
    cascade: true,
    eager: true,
  })
  detalles: DetalleNotaVenta[];

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Field(() => EstadoNotaVenta)
  @Column({
    type: 'varchar',
    default: EstadoNotaVenta.PENDIENTE,
  })
  estado: EstadoNotaVenta;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
