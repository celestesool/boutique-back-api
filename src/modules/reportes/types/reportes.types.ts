import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../auth/entities/user.entity';

@ObjectType()
export class ReporteVentas {
  @Field(() => Int)
  totalVentas: number;

  @Field(() => Float)
  montoTotal: number;

  @Field(() => Float)
  promedioVenta: number;

  @Field(() => Int)
  ventasProcesadas: number;

  @Field(() => Int)
  ventasPendientes: number;

  @Field(() => Int)
  ventasCanceladas: number;
}

@ObjectType()
export class ProductoMasVendido {
  @Field(() => Product)
  producto: Product;

  @Field(() => Int)
  cantidadVendida: number;

  @Field(() => Float)
  montoTotal: number;
}

@ObjectType()
export class UsuarioActivo {
  @Field(() => User)
  usuario: User;

  @Field(() => Int)
  totalCompras: number;

  @Field(() => Float)
  montoTotal: number;
}

@ObjectType()
export class ProductoBajoStock {
  @Field(() => Product)
  producto: Product;

  @Field(() => Int)
  stockActual: number;

  @Field(() => Int)
  stockMinimo: number;
}

@ObjectType()
export class ReporteInventario {
  @Field(() => Int)
  totalProductos: number;

  @Field(() => Int)
  productosActivos: number;

  @Field(() => Int)
  productosInactivos: number;

  @Field(() => Int)
  productosSinStock: number;

  @Field(() => Int)
  productosBajoStock: number;

  @Field(() => Float)
  valorTotalInventario: number;
}

@ObjectType()
export class VentaPorFecha {
  @Field()
  fecha: string;

  @Field(() => Int)
  cantidadVentas: number;

  @Field(() => Float)
  montoTotal: number;
}

@ObjectType()
export class ReporteGeneral {
  @Field(() => ReporteVentas)
  ventas: ReporteVentas;

  @Field(() => ReporteInventario)
  inventario: ReporteInventario;

  @Field(() => [ProductoMasVendido])
  productosMasVendidos: ProductoMasVendido[];

  @Field(() => [UsuarioActivo])
  usuariosMasActivos: UsuarioActivo[];

  @Field(() => [ProductoBajoStock])
  productosBajoStock: ProductoBajoStock[];
}
