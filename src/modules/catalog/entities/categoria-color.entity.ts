import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Color } from './color.entity';

@ObjectType()
@Entity('categorias_colores')
export class CategoriaColor {
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

  @Field(() => [Color])
  @ManyToMany(() => Color, (color) => color.categoriasColores)
  @JoinTable({
    name: 'categoria_color_colores',
    joinColumn: { name: 'categoria_color_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'color_id', referencedColumnName: 'id' },
  })
  colores: Color[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
