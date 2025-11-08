import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Categoria } from '../../catalog/entities/categoria.entity';
import { Marca } from '../../catalog/entities/marca.entity';
import { Descuento } from '../../catalog/entities/descuento.entity';
import { Color } from '../../catalog/entities/color.entity';
import { Talla } from '../../catalog/entities/talla.entity';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 255 })
  nombre: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  descripcion: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Field(() => Int)
  @Column({ default: 0 })
  stock: number;

  @Field(() => Int)
  @Column({ default: 0 })
  popularidad: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  categoria?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imagen_url: string;

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field()
  @CreateDateColumn()
  fecha_agregado: Date;

  // ==================== RELACIONES ====================

  @Field(() => Categoria, { nullable: true })
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { nullable: true })
  @JoinColumn({ name: 'categoria_id' })
  categoriaRelacion?: Categoria;

  @Field(() => Marca, { nullable: true })
  @ManyToOne(() => Marca, (marca) => marca.productos, { nullable: true })
  @JoinColumn({ name: 'marca_id' })
  marca?: Marca;

  @Field(() => Descuento, { nullable: true })
  @ManyToOne(() => Descuento, (descuento) => descuento.productos, { nullable: true })
  @JoinColumn({ name: 'descuento_id' })
  descuento?: Descuento;

  @Field(() => [Color], { nullable: true })
  @ManyToMany(() => Color, (color) => color.productos)
  @JoinTable({
    name: 'producto_colores',
    joinColumn: { name: 'producto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'color_id', referencedColumnName: 'id' },
  })
  colores?: Color[];

  @Field(() => [Talla], { nullable: true })
  @ManyToMany(() => Talla, (talla) => talla.productos)
  @JoinTable({
    name: 'producto_tallas',
    joinColumn: { name: 'producto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'talla_id', referencedColumnName: 'id' },
  })
  tallas?: Talla[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
