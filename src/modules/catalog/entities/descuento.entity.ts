import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('descuentos')
export class Descuento {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(() => Float)
  @Column('decimal', { precision: 5, scale: 2 })
  porcentaje: number;

  @Field()
  @Column({ type: 'date' })
  fechaInicio: Date;

  @Field()
  @Column({ type: 'date' })
  fechaFin: Date;

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.descuento)
  productos: Product[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
