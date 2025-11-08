import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rol, Permiso]),
    AuthModule,
  ],
  providers: [RolesResolver, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
