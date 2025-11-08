import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('categorias')
export class Categoria {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  nombre: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  descripcion: string;

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.categoria)
  productos: Product[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
