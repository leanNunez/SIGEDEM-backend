import { Module } from '@nestjs/common';

// Autenticación y permisos: login con JWT, guard global (todo protegido salvo
// @Public()) y control de acceso por rol con @Roles().
@Module({
  controllers: [],
  providers: [],
})
export class AuthModule {}
