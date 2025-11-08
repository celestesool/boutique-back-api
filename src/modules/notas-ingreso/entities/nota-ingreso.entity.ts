import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { DetalleNotaIngreso } from './detalle-nota-ingreso.entity';

@ObjectType()
@Entity('notas_ingreso')
export class NotaIngreso {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  numero_nota: string; // NI-2025-001

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Field()
  @Column({ type: 'varchar', length: 200 })
  proveedor: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Field()
  @Column({
    type: 'enum',
    enum: ['pendiente', 'procesada', 'cancelada'],
    default: 'pendiente',
  })
  estado: string;

  @Field(() => [DetalleNotaIngreso])
  @OneToMany(() => DetalleNotaIngreso, (detalle) => detalle.notaIngreso, {
    cascade: true,
    eager: true,
  })
  detalles: DetalleNotaIngreso[];

  @Field()
  @CreateDateColumn()
  fecha_creacion: Date;

  @Field()
  @UpdateDateColumn()
  fecha_actualizacion: Date;
}
