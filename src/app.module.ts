import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { BusquedasModule } from './modules/busquedas/busquedas.module';
import { CartModule } from './modules/cart/cart.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { NotasIngresoModule } from './modules/notas-ingreso/notas-ingreso.module';
import { NotasVentaModule } from './modules/notas-venta/notas-venta.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { ReportesModule } from './modules/reportes/reportes.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'aws-1-us-east-1.pooler.supabase.com',
      port: parseInt(process.env.DB_PORT || '6543'),
      username: process.env.DB_USER || 'postgres.ezojnzrongulnxcyoewy',
      password: process.env.DB_PASSWORD || 'Develop2025$',
      database: process.env.DB_NAME || 'postgres',
      entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
      synchronize: true,
      logging: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
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
      playground: true,
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
    CartModule,
    ReportesModule,
  ],
})
export class AppModule { }
