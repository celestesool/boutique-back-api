import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Field()
  @Column()
  stock: number;

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
  createdAt: Date;
}
