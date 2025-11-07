# GUIA COMPLETA DE PRUEBAS - BACKEND BOUTIQUE API

## INFORMACION GENERAL

**Endpoint GraphQL:** http://localhost:3001/graphql
**Puerto:** 3001
**Base de datos:** PostgreSQL
**Autenticacion:** JWT (Bearer Token)

---

## INDICE

1. [Autenticacion](#1-autenticacion)
2. [Gestion de Usuarios](#2-gestion-de-usuarios)
3. [Gestion de Productos](#3-gestion-de-productos)
4. [Gestion de Ordenes](#4-gestion-de-ordenes)
5. [Paginacion y Filtros](#5-paginacion-y-filtros)
6. [Validaciones](#6-validaciones)
7. [Casos de Prueba Completos](#7-casos-de-prueba-completos)
8. [Matriz de Permisos](#8-matriz-de-permisos)

---

## 1. AUTENTICACION

### 1.1 Registrar Usuario

**Mutation:**
```graphql
mutation {
  register(input: {
    nombre: "Juan Perez"
    email: "juan@example.com"
    password: "123456"
  }) {
    accessToken
    user {
      id
      nombre
      email
      rol
      createdAt
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "register": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "uuid-generado",
        "nombre": "Juan Perez",
        "email": "juan@example.com",
        "rol": "cliente",
        "createdAt": "2025-11-07T..."
      }
    }
  }
}
```

**Validaciones:**
- Email debe ser valido
- Nombre minimo 2 caracteres, maximo 100
- Password minimo 6 caracteres, maximo 50
- Email no puede estar duplicado
- Rol por defecto: "cliente"

### 1.2 Login

**Mutation:**
```graphql
mutation {
  login(input: {
    email: "juan@example.com"
    password: "123456"
  }) {
    accessToken
    user {
      id
      nombre
      email
      rol
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "uuid-del-usuario",
        "nombre": "Juan Perez",
        "email": "juan@example.com",
        "rol": "cliente"
      }
    }
  }
}
```

**Validaciones:**
- Credenciales correctas
- Usuario debe existir
- Password debe coincidir (bcrypt)

### 1.3 Obtener Usuario Actual

**Query:**
```graphql
query {
  me {
    id
    nombre
    email
    rol
    createdAt
  }
}
```

**Headers HTTP requeridos:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "me": {
      "id": "uuid-del-usuario",
      "nombre": "Juan Perez",
      "email": "juan@example.com",
      "rol": "cliente",
      "createdAt": "2025-11-07T..."
    }
  }
}
```

---

## 2. GESTION DE USUARIOS

**IMPORTANTE:** Agregar token en HTTP Headers para todas las operaciones:
```json
{
  "Authorization": "Bearer TU_ACCESS_TOKEN"
}
```

### 2.1 Ver Mi Perfil

**Query:**
```graphql
query {
  miPerfil {
    id
    nombre
    email
    rol
    createdAt
  }
}
```

**Permisos:** Cualquier usuario autenticado

### 2.2 Ver Todos los Usuarios (Admin)

**Query:**
```graphql
query {
  usuarios {
    id
    nombre
    email
    rol
    createdAt
  }
}
```

**Permisos:** Solo admin

### 2.3 Ver Usuario Especifico

**Query:**
```graphql
query {
  usuario(id: "uuid-del-usuario") {
    id
    nombre
    email
    rol
    createdAt
  }
}
```

**Permisos:** Admin o el mismo usuario

### 2.4 Actualizar Mi Perfil

**Mutation:**
```graphql
mutation {
  actualizarPerfil(input: {
    nombre: "Juan Perez Actualizado"
    email: "nuevoemail@example.com"
    password: "nuevaPassword123"
  }) {
    id
    nombre
    email
    rol
  }
}
```

**Validaciones:**
- Nombre: 2-100 caracteres (opcional)
- Email: formato valido (opcional)
- Password: minimo 6 caracteres (opcional)
- Email no puede estar duplicado

**Permisos:** Usuario autenticado (solo su propio perfil)

### 2.5 Actualizar Usuario (Admin)

**Mutation:**
```graphql
mutation {
  actualizarUsuario(id: "uuid-del-usuario", input: {
    nombre: "Nuevo Nombre"
    email: "nuevo@example.com"
  }) {
    id
    nombre
    email
    rol
  }
}
```

**Permisos:** Solo admin

### 2.6 Cambiar Rol de Usuario (Admin)

**Mutation:**
```graphql
mutation {
  cambiarRolUsuario(id: "uuid-del-usuario", input: {
    rol: "admin"
  }) {
    id
    nombre
    email
    rol
  }
}
```

**Valores permitidos para rol:** "cliente" | "admin"

**Permisos:** Solo admin

### 2.7 Eliminar Usuario (Admin)

**Mutation:**
```graphql
mutation {
  eliminarUsuario(id: "uuid-del-usuario") {
    id
    nombre
    email
  }
}
```

**Permisos:** Solo admin
**Efecto:** Elimina el usuario y todas sus ordenes (CASCADE)

---

## 3. GESTION DE PRODUCTOS

### 3.1 Listar Todos los Productos

**Query:**
```graphql
query {
  getProducts {
    id
    nombre
    descripcion
    precio
    stock
    categoria
    imagen_url
    activo
    createdAt
  }
}
```

**Permisos:** Publico (sin autenticacion)

### 3.2 Obtener Producto por ID

**Query:**
```graphql
query {
  getProduct(id: "uuid-del-producto") {
    id
    nombre
    descripcion
    precio
    stock
    categoria
    imagen_url
    activo
    createdAt
  }
}
```

**Permisos:** Publico

### 3.3 Crear Producto

**Mutation:**
```graphql
mutation {
  createProduct(input: {
    nombre: "Camiseta Roja"
    descripcion: "Camiseta de algodon 100%"
    precio: 29.99
    stock: 50
    categoria: "Ropa"
    imagen_url: "https://example.com/image.jpg"
  }) {
    id
    nombre
    precio
    stock
    categoria
  }
}
```

**Headers HTTP requeridos:**
```json
{
  "Authorization": "Bearer TU_ACCESS_TOKEN"
}
```

**Validaciones:**
- Nombre: 3-100 caracteres (requerido)
- Descripcion: 10-500 caracteres (requerido)
- Precio: mayor a 0 (requerido)
- Stock: mayor o igual a 0 (requerido)
- Categoria: maximo 50 caracteres (opcional)
- imagen_url: URL valida (opcional)

**Permisos:** Usuario autenticado

### 3.4 Actualizar Producto

**Mutation:**
```graphql
mutation {
  updateProduct(id: "uuid-del-producto", input: {
    nombre: "Camiseta Roja Actualizada"
    precio: 34.99
    stock: 45
  }) {
    id
    nombre
    precio
    stock
  }
}
```

**Permisos:** Usuario autenticado

### 3.5 Eliminar Producto

**Mutation:**
```graphql
mutation {
  deleteProduct(id: "uuid-del-producto")
}
```

**Permisos:** Usuario autenticado

---

## 4. GESTION DE ORDENES

### 4.1 Crear Orden

**Mutation:**
```graphql
mutation {
  crearOrden(input: {
    items: [
      {
        productId: "uuid-producto-1"
        cantidad: 2
      },
      {
        productId: "uuid-producto-2"
        cantidad: 1
      }
    ]
  }) {
    id
    subtotal
    impuestos
    envio
    total
    estado
    createdAt
    items {
      id
      cantidad
      precioUnitario
      subtotal
      product {
        nombre
        precio
      }
    }
  }
}
```

**Headers HTTP requeridos:**
```json
{
  "Authorization": "Bearer TU_ACCESS_TOKEN"
}
```

**Validaciones:**
- Al menos 1 item requerido
- productId: UUID valido
- cantidad: minimo 1
- Stock suficiente del producto

**Calculos automaticos:**
- Subtotal: suma de (precio * cantidad) de cada item
- Impuestos: 19% del subtotal (IVA)
- Envio: $10 si subtotal <= $100, $0 si subtotal > $100
- Total: subtotal + impuestos + envio

**Efectos:**
- Reduce el stock de cada producto
- Crea items de orden vinculados
- Estado inicial: "pendiente"

**Permisos:** Usuario autenticado

### 4.2 Ver Mis Ordenes

**Query:**
```graphql
query {
  misOrdenes {
    id
    subtotal
    impuestos
    envio
    total
    estado
    numeroSeguimiento
    createdAt
    items {
      cantidad
      precioUnitario
      subtotal
      product {
        nombre
      }
    }
  }
}
```

**Permisos:** Usuario autenticado (solo ve sus propias ordenes)

### 4.3 Ver Orden Especifica

**Query:**
```graphql
query {
  orden(id: "uuid-de-la-orden") {
    id
    subtotal
    impuestos
    envio
    total
    estado
    numeroSeguimiento
    createdAt
    user {
      nombre
      email
    }
    items {
      cantidad
      precioUnitario
      subtotal
      product {
        nombre
        precio
      }
    }
  }
}
```

**Permisos:** Usuario autenticado

### 4.4 Ver Todas las Ordenes (Admin)

**Query:**
```graphql
query {
  todasLasOrdenes {
    id
    subtotal
    total
    estado
    createdAt
    user {
      nombre
      email
    }
  }
}
```

**Permisos:** Solo admin

### 4.5 Actualizar Orden

**Mutation:**
```graphql
mutation {
  actualizarOrden(id: "uuid-de-la-orden", input: {
    estado: "pagado"
    numeroSeguimiento: "TRACK123456"
  }) {
    id
    estado
    numeroSeguimiento
  }
}
```

**Estados permitidos:**
- "pendiente"
- "pagado"
- "enviado"
- "entregado"
- "cancelado"

**Validaciones:**
- estado: debe ser un valor valido del enum
- numeroSeguimiento: maximo 100 caracteres (opcional)

**Permisos:** Propietario de la orden o admin

### 4.6 Eliminar Orden (Admin)

**Mutation:**
```graphql
mutation {
  eliminarOrden(id: "uuid-de-la-orden") {
    id
    total
  }
}
```

**Efectos:**
- Elimina la orden
- Elimina todos los items de la orden (CASCADE)
- Restaura el stock de los productos

**Permisos:** Solo admin

---

## 5. PAGINACION Y FILTROS

### 5.1 Productos Paginados

**Query:**
```graphql
query {
  getProductsPaginated(
    pagination: {
      page: 1
      limit: 10
    }
    filters: {
      categoria: "Ropa"
      precioMin: 20.0
      precioMax: 100.0
      buscar: "camisa"
      ordenarPor: "precio"
      orden: "ASC"
    }
  ) {
    items {
      id
      nombre
      precio
      stock
      categoria
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

**Parametros de paginacion:**
- page: numero de pagina (default: 1, minimo: 1)
- limit: items por pagina (default: 10, minimo: 1, maximo: 100)

**Parametros de filtros:**
- categoria: texto exacto (opcional)
- precioMin: numero decimal (opcional)
- precioMax: numero decimal (opcional)
- buscar: busqueda en nombre y descripcion, case-insensitive (opcional)
- ordenarPor: campo para ordenar (default: "createdAt")
- orden: "ASC" o "DESC" (default: "DESC")

**Campos ordenables:** nombre, precio, stock, categoria, createdAt

### 5.2 Mis Ordenes Paginadas

**Query:**
```graphql
query {
  misOrdenesPaginadas(
    pagination: {
      page: 1
      limit: 5
    }
    filters: {
      estado: "pagado"
      ordenarPor: "createdAt"
      orden: "DESC"
    }
  ) {
    items {
      id
      total
      estado
      createdAt
      items {
        cantidad
        product {
          nombre
        }
      }
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

**Headers HTTP requeridos:**
```json
{
  "Authorization": "Bearer TU_ACCESS_TOKEN"
}
```

**Parametros de filtros:**
- estado: "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado" (opcional)
- ordenarPor: campo para ordenar (default: "createdAt")
- orden: "ASC" o "DESC" (default: "DESC")

**Permisos:** Usuario autenticado (solo ve sus ordenes)

### 5.3 Todas las Ordenes Paginadas (Admin)

**Query:**
```graphql
query {
  todasLasOrdenesPaginadas(
    pagination: {
      page: 1
      limit: 10
    }
    filters: {
      estado: "pendiente"
      ordenarPor: "total"
      orden: "DESC"
    }
  ) {
    items {
      id
      total
      estado
      createdAt
      user {
        nombre
        email
      }
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      hasNextPage
    }
  }
}
```

**Permisos:** Solo admin

---

## 6. VALIDACIONES

### 6.1 Validaciones de Registro

**Caso 1: Email invalido**
```graphql
mutation {
  register(input: {
    nombre: "Juan"
    email: "email-invalido"
    password: "123456"
  }) {
    accessToken
  }
}
```

**Error esperado:** "Debe ser un email valido"

**Caso 2: Password muy corto**
```graphql
mutation {
  register(input: {
    nombre: "Juan"
    email: "juan@example.com"
    password: "123"
  }) {
    accessToken
  }
}
```

**Error esperado:** "La contrasena debe tener al menos 6 caracteres"

**Caso 3: Nombre muy corto**
```graphql
mutation {
  register(input: {
    nombre: "J"
    email: "juan@example.com"
    password: "123456"
  }) {
    accessToken
  }
}
```

**Error esperado:** "El nombre debe tener al menos 2 caracteres"

### 6.2 Validaciones de Productos

**Caso 1: Precio negativo**
```graphql
mutation {
  createProduct(input: {
    nombre: "Producto Test"
    descripcion: "Descripcion del producto"
    precio: -10.0
    stock: 50
  }) {
    id
  }
}
```

**Error esperado:** "El precio debe ser mayor a 0"

**Caso 2: Descripcion muy corta**
```graphql
mutation {
  createProduct(input: {
    nombre: "Producto Test"
    descripcion: "Corta"
    precio: 29.99
    stock: 50
  }) {
    id
  }
}
```

**Error esperado:** "La descripcion debe tener al menos 10 caracteres"

### 6.3 Validaciones de Ordenes

**Caso 1: Sin items**
```graphql
mutation {
  crearOrden(input: {
    items: []
  }) {
    id
  }
}
```

**Error esperado:** "Debe incluir al menos un producto"

**Caso 2: Cantidad invalida**
```graphql
mutation {
  crearOrden(input: {
    items: [
      {
        productId: "uuid-producto"
        cantidad: 0
      }
    ]
  }) {
    id
  }
}
```

**Error esperado:** "La cantidad debe ser al menos 1"

---

## 7. CASOS DE PRUEBA COMPLETOS

### 7.1 Flujo Completo de Cliente

**Paso 1: Registrarse**
```graphql
mutation {
  register(input: {
    nombre: "Maria Garcia"
    email: "maria@example.com"
    password: "123456"
  }) {
    accessToken
    user {
      id
      nombre
      email
      rol
    }
  }
}
```

Guardar: accessToken, userId

**Paso 2: Ver productos disponibles**
```graphql
query {
  getProducts {
    id
    nombre
    precio
    stock
  }
}
```

Guardar: productId1, productId2

**Paso 3: Crear orden**

Headers:
```json
{
  "Authorization": "Bearer ACCESS_TOKEN_DE_PASO_1"
}
```

```graphql
mutation {
  crearOrden(input: {
    items: [
      {
        productId: "PRODUCT_ID_1"
        cantidad: 2
      },
      {
        productId: "PRODUCT_ID_2"
        cantidad: 1
      }
    ]
  }) {
    id
    subtotal
    impuestos
    envio
    total
    estado
  }
}
```

Verificar:
- subtotal = suma de (precio * cantidad)
- impuestos = subtotal * 0.19
- envio = 10 si subtotal <= 100, sino 0
- total = subtotal + impuestos + envio
- estado = "pendiente"

**Paso 4: Ver mis ordenes**
```graphql
query {
  misOrdenes {
    id
    total
    estado
    createdAt
  }
}
```

Verificar: la orden creada aparece en la lista

**Paso 5: Actualizar mi perfil**
```graphql
mutation {
  actualizarPerfil(input: {
    nombre: "Maria Garcia Actualizado"
  }) {
    id
    nombre
    email
  }
}
```

Verificar: nombre actualizado correctamente

### 7.2 Flujo Completo de Admin

**Paso 1: Login como admin**
```graphql
mutation {
  login(input: {
    email: "admin@example.com"
    password: "admin123"
  }) {
    accessToken
    user {
      id
      nombre
      rol
    }
  }
}
```

Verificar: rol = "admin"

**Paso 2: Ver todos los usuarios**

Headers:
```json
{
  "Authorization": "Bearer ADMIN_ACCESS_TOKEN"
}
```

```graphql
query {
  usuarios {
    id
    nombre
    email
    rol
  }
}
```

Verificar: lista completa de usuarios

**Paso 3: Cambiar rol de usuario**
```graphql
mutation {
  cambiarRolUsuario(id: "USER_ID", input: {
    rol: "admin"
  }) {
    id
    nombre
    rol
  }
}
```

Verificar: rol actualizado a "admin"

**Paso 4: Ver todas las ordenes**
```graphql
query {
  todasLasOrdenes {
    id
    total
    estado
    user {
      nombre
      email
    }
  }
}
```

Verificar: lista completa de ordenes de todos los usuarios

**Paso 5: Actualizar estado de orden**
```graphql
mutation {
  actualizarOrden(id: "ORDER_ID", input: {
    estado: "enviado"
    numeroSeguimiento: "TRACK123456"
  }) {
    id
    estado
    numeroSeguimiento
  }
}
```

Verificar: estado y numero de seguimiento actualizados

### 7.3 Prueba de Paginacion

**Paso 1: Crear multiples productos (10+)**

Repetir 15 veces con datos diferentes:
```graphql
mutation {
  createProduct(input: {
    nombre: "Producto X"
    descripcion: "Descripcion del producto X"
    precio: X.99
    stock: X0
    categoria: "Categoria X"
  }) {
    id
  }
}
```

**Paso 2: Obtener primera pagina**
```graphql
query {
  getProductsPaginated(
    pagination: { page: 1, limit: 5 }
  ) {
    items {
      id
      nombre
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}
```

Verificar:
- items.length = 5
- currentPage = 1
- totalPages = 3 (15 items / 5 per page)
- totalItems = 15
- hasNextPage = true
- hasPreviousPage = false

**Paso 3: Obtener segunda pagina**
```graphql
query {
  getProductsPaginated(
    pagination: { page: 2, limit: 5 }
  ) {
    pageInfo {
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

Verificar:
- currentPage = 2
- hasNextPage = true
- hasPreviousPage = true

**Paso 4: Filtrar por precio**
```graphql
query {
  getProductsPaginated(
    filters: {
      precioMin: 5.0
      precioMax: 10.0
    }
  ) {
    items {
      nombre
      precio
    }
  }
}
```

Verificar: todos los items tienen precio entre 5 y 10

**Paso 5: Busqueda por texto**
```graphql
query {
  getProductsPaginated(
    filters: {
      buscar: "producto"
    }
  ) {
    items {
      nombre
    }
  }
}
```

Verificar: todos los items contienen "producto" en nombre o descripcion

### 7.4 Prueba de Stock

**Paso 1: Crear producto con stock limitado**
```graphql
mutation {
  createProduct(input: {
    nombre: "Producto Stock Test"
    descripcion: "Producto para probar stock"
    precio: 50.0
    stock: 5
  }) {
    id
    stock
  }
}
```

Guardar: productId, stock inicial = 5

**Paso 2: Crear orden con cantidad valida**
```graphql
mutation {
  crearOrden(input: {
    items: [
      {
        productId: "PRODUCT_ID"
        cantidad: 3
      }
    ]
  }) {
    id
  }
}
```

**Paso 3: Verificar stock reducido**
```graphql
query {
  getProduct(id: "PRODUCT_ID") {
    stock
  }
}
```

Verificar: stock = 2 (5 - 3)

**Paso 4: Intentar orden con stock insuficiente**
```graphql
mutation {
  crearOrden(input: {
    items: [
      {
        productId: "PRODUCT_ID"
        cantidad: 5
      }
    ]
  }) {
    id
  }
}
```

**Error esperado:** "Stock insuficiente para Producto Stock Test. Disponible: 2"

### 7.5 Prueba de Calculos de Orden

**Caso 1: Orden pequena (con envio)**

Producto 1: $30.00 x 2 = $60.00
Subtotal: $60.00
Impuestos (19%): $11.40
Envio (subtotal <= 100): $10.00
Total: $81.40

**Caso 2: Orden grande (envio gratis)**

Producto 1: $60.00 x 2 = $120.00
Subtotal: $120.00
Impuestos (19%): $22.80
Envio (subtotal > 100): $0.00
Total: $142.80

**Caso 3: Orden mixta**

Producto 1: $25.00 x 2 = $50.00
Producto 2: $30.00 x 1 = $30.00
Subtotal: $80.00
Impuestos (19%): $15.20
Envio (subtotal <= 100): $10.00
Total: $105.20

---

## 8. MATRIZ DE PERMISOS

### 8.1 Autenticacion

| Operacion | Anonimo | Cliente | Admin |
|-----------|---------|---------|-------|
| register  | Si      | Si      | Si    |
| login     | Si      | Si      | Si    |
| me        | No      | Si      | Si    |

### 8.2 Usuarios

| Operacion | Anonimo | Cliente | Admin |
|-----------|---------|---------|-------|
| miPerfil | No | Si | Si |
| usuario(id) | No | Solo su ID | Cualquier ID |
| usuarios | No | No | Si |
| actualizarPerfil | No | Solo su perfil | Su perfil |
| actualizarUsuario(id) | No | No | Si |
| cambiarRolUsuario | No | No | Si |
| eliminarUsuario | No | No | Si |

### 8.3 Productos

| Operacion | Anonimo | Cliente | Admin |
|-----------|---------|---------|-------|
| getProducts | Si | Si | Si |
| getProductsPaginated | Si | Si | Si |
| getProduct(id) | Si | Si | Si |
| createProduct | No | Si | Si |
| updateProduct | No | Si | Si |
| deleteProduct | No | Si | Si |

### 8.4 Ordenes

| Operacion | Anonimo | Cliente | Admin |
|-----------|---------|---------|-------|
| misOrdenes | No | Solo sus ordenes | Sus ordenes |
| misOrdenesPaginadas | No | Solo sus ordenes | Sus ordenes |
| orden(id) | No | Si | Si |
| todasLasOrdenes | No | No | Si |
| todasLasOrdenesPaginadas | No | No | Si |
| crearOrden | No | Si | Si |
| actualizarOrden | No | Propietario | Si |
| eliminarOrden | No | No | Si |

---

## 9. ERRORES COMUNES Y SOLUCIONES

### 9.1 Error: "No se proporciono token de autenticacion"

**Causa:** No se envio el header Authorization

**Solucion:** Agregar en HTTP Headers:
```json
{
  "Authorization": "Bearer TU_ACCESS_TOKEN"
}
```

### 9.2 Error: "Token invalido o expirado"

**Causa:** Token incorrecto, malformado o expirado (24 horas)

**Solucion:** 
1. Verificar que el token este completo
2. Hacer login nuevamente para obtener nuevo token

### 9.3 Error: "Solo los administradores pueden acceder"

**Causa:** Endpoint requiere rol admin, pero el usuario es cliente

**Solucion:**
1. Usar cuenta con rol admin
2. O cambiar el rol del usuario actual (requiere admin)

### 9.4 Error: "El email ya esta en uso"

**Causa:** Email duplicado al registrar o actualizar

**Solucion:** Usar un email diferente

### 9.5 Error: "Stock insuficiente"

**Causa:** Intentar ordenar mas unidades de las disponibles

**Solucion:** 
1. Verificar stock disponible con getProduct
2. Reducir cantidad en la orden

### 9.6 Error: "This anonymous operation must be the only defined operation"

**Causa:** Multiples mutations/queries sin nombre en una peticion

**Solucion:**
1. Ejecutar una operacion a la vez
2. O nombrar las operaciones

---

## 10. CONFIGURACION INICIAL

### 10.1 Crear Primer Admin

**Opcion 1: Via SQL en PostgreSQL**
```sql
UPDATE users 
SET rol = 'admin' 
WHERE email = 'tu-email@example.com';
```

**Opcion 2: Via GraphQL (requiere admin existente)**
```graphql
mutation {
  cambiarRolUsuario(id: "USER_ID", input: {
    rol: "admin"
  }) {
    id
    rol
  }
}
```

### 10.2 Datos de Prueba Recomendados

**Usuarios:**
- Admin: admin@example.com / admin123
- Cliente 1: maria@example.com / 123456
- Cliente 2: juan@example.com / 123456

**Productos:**
- Camiseta Roja - $29.99 - Stock: 50 - Categoria: Ropa
- Pantalon Azul - $49.99 - Stock: 30 - Categoria: Ropa
- Zapatos Negros - $79.99 - Stock: 20 - Categoria: Calzado
- Gorra Blanca - $19.99 - Stock: 100 - Categoria: Accesorios

---

## 11. NOTAS TECNICAS

### 11.1 Tokens JWT
- Expiracion: 24 horas
- Secret: definido en JWT_SECRET (env) o "secretKey" (default)
- Payload incluye: sub (userId), email, rol

### 11.2 Passwords
- Hash: bcrypt con 10 rounds
- Minimo: 6 caracteres
- Maximo: 50 caracteres

### 11.3 Base de Datos
- Tipo: PostgreSQL
- Puerto: 5432 (default)
- Sincronizacion: automatica (synchronize: true)
- Cascadas: User -> Orders, Order -> OrderItems

### 11.4 Validaciones
- Pipe global: ValidationPipe con whitelist, forbidNonWhitelisted, transform
- Decoradores: class-validator
- Mensajes: personalizados en espanol

### 11.5 Calculos de Orden
- IVA: 19% del subtotal
- Envio: $10 si subtotal <= $100, $0 si subtotal > $100
- Precision: 2 decimales (DECIMAL 10,2)

---

FIN DEL DOCUMENTO
