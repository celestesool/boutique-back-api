import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from './rol.entity';

@ObjectType()
@Entity('permisos')
export class Permiso {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  nombre: string;

  @Field()
  @Column({ unique: true })
  codigo: string; // ej: "crear_producto", "editar_usuario"

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Field()
  @Column({ default: 'general' })
  modulo: string; // productos, usuarios, ordenes, etc.

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field(() => [Rol])
  @ManyToMany(() => Rol, (rol) => rol.permisos)
  roles: Rol[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
