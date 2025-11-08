import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { CategoriaColor } from './categoria-color.entity';

@ObjectType()
@Entity('colores')
export class Color {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  nombre: string;

  @Field()
  @Column()
  codigoHex: string;

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.colores)
  productos: Product[];

  @Field(() => [CategoriaColor], { nullable: true })
  @ManyToMany(() => CategoriaColor, (categoriaColor) => categoriaColor.colores)
  categoriasColores: CategoriaColor[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
