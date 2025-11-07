# boutique-api (Microservicio 4: Gestión Empresarial)

Esto crea la estructura base del microservicio usando NestJS + GraphQL + TypeORM (Postgres).

Archivos creados:
- `src/main.ts` - bootstrap de la app
- `src/app.module.ts` - configuración (TypeORM + GraphQL + Config)
- `src/modules/products/*` - módulo, servicio, resolver, entidad y DTOs de productos
- `src/modules/orders/*` y `src/modules/users/*` - módulos placeholder
- `.env` - variables de entorno
- `tsconfig.json` y `tsconfig.build.json`

Pasos para poner en marcha (PowerShell en Windows):

1) Instalar dependencias:

```powershell
npm install
```

2) Iniciar en modo desarrollo (usa `ts-node-dev`):

```powershell
npm run start:dev
```

3) Si todo funciona, abrir GraphQL Playground en:

http://localhost:3000/graphql

Notas:
- Asegúrate de crear la base de datos y el usuario en Postgres tal como indicaste (psql ... CREATE DATABASE boutique_db; ...).
- En desarrollo `synchronize: true` está activado para TypeORM; desactívalo en producción.
- Si prefieres usar `nest` CLI, instala `@nestjs/cli` globalmente o como devDependency (`npm install --save-dev @nestjs/cli`) y usa `nest generate`.
