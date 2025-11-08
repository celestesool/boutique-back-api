import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { BusquedasModule } from './modules/busquedas/busquedas.module';
import { NotasIngresoModule } from './modules/notas-ingreso/notas-ingreso.module';
import { RolesModule } from './modules/roles/roles.module';
import { NotasVentaModule } from './modules/notas-venta/notas-venta.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
      synchronize: true, // ✅ Recreará automáticamente todas las tablas
      logging: false,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, 'schema.gql'),
      context: ({ req, res }) => ({
        req: {
          ...req,
          headers: req?.headers || {},
        },
        res,
      }),
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    CatalogModule,
    BusquedasModule,
    NotasIngresoModule,
    RolesModule,
    NotasVentaModule,
  ],
})
export class AppModule {}
