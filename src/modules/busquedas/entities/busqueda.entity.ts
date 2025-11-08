import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('busquedas')
export class Busqueda {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Product;

  @Field()
  @CreateDateColumn()
  fecha_busqueda: Date;

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'exitoso' })
  resultado: string; // 'exitoso', 'fallido', 'visto'
}
