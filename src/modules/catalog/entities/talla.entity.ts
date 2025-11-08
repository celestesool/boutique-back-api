import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('tallas')
export class Talla {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  nombre: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  medida: string;

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.tallas)
  productos: Product[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
