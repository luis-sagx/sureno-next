# Licorería Sureño

Plataforma de e-commerce para distribución premium de licores. Ofrece venta individual (retail) y al mayoreo (B2B) con precios escalonados por volumen, dirigida al sector HORECA y clientes exigentes.

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 15** (App Router, TypeScript) | Frontend + API Routes |
| **Supabase** | Autenticación + Base de datos PostgreSQL |
| **Prisma 7** | ORM y migraciones |
| **Zustand 5** | Estado del carrito de compras (localStorage) |
| **Tailwind CSS 4** | Sistema de diseño y estilos |
| **next-themes** | Modo oscuro / claro |
| **Vitest 4** | Tests unitarios e integración |
| **Playwright 1.60** | Tests end-to-end |
| **Zod 4** | Validación de formularios y Server Actions |

## Primeros Pasos

### Requisitos

- Node.js 24+
- Cuenta de Supabase (proyecto con PostgreSQL)

### Instalación

```bash
git clone <repo-url>
cd sureno
npm install
```

### Variables de Entorno

Crear un archivo `.env` en la raíz con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Base de datos (connection string de Supabase)
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres

# URL de la aplicación
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Migración y Seed

```bash
# Generar el cliente de Prisma
npx prisma generate

# Aplicar migraciones
npx prisma migrate dev --name init

# Sembrar datos de prueba
npm run db:seed
```

### Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Estructura del Proyecto

```
src/
├── app/
│   ├── (customer)/        # Rutas de la tienda (cliente)
│   │   ├── page.tsx       # Homepage
│   │   ├── catalog/       # Catálogo de productos
│   │   ├── product/[slug]/# Detalle de producto
│   │   ├── checkout/      # Proceso de compra
│   │   ├── checkout/success/
│   │   └── about/         # Acerca de
│   ├── (admin)/           # Panel de administración
│   │   ├── orders/        # Gestión de órdenes
│   │   ├── inventory/     # Gestión de inventario
│   │   └── users/         # Directorio de usuarios
│   ├── auth/              # Login y registro
│   │   ├── login/
│   │   └── register/
│   ├── api/auth/callback/ # Callback de Supabase Auth
│   ├── layout.tsx         # Layout raíz
│   └── globals.css        # Design tokens y estilos base
├── components/
│   ├── ui/                # Primitivos de diseño (Button, Input, etc.)
│   ├── layout/            # Header, Footer
│   ├── home/              # HeroSection, CategoryGrid, etc.
│   ├── catalog/           # FilterSidebar, PricingToggle
│   ├── product/           # ProductCard, ProductGallery
│   ├── cart/              # CartDrawer, CartIcon
│   └── checkout/          # ShippingForm, OrderSummary
├── lib/
│   ├── prisma.ts          # Singleton del cliente Prisma
│   ├── pricing.ts         # Lógica de precios (retail + mayoreo)
│   ├── utils.ts           # Utilidades (cn, formatCurrency)
│   └── supabase/          # Clientes de Supabase (server, client, middleware)
├── store/
│   ├── cart.ts            # Zustand: carrito persistente
│   └── ui.ts              # Zustand: estado de UI
├── actions/               # Server Actions
│   ├── auth.ts            # signIn, signUp, signOut
│   ├── checkout.ts        # createOrder
│   └── admin.ts           # Acciones de administración
├── middleware.ts           # Protección de rutas /admin
└── types/                  # Tipos compartidos
e2e/                        # Tests end-to-end (Playwright)
```

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run test` | Ejecutar tests unitarios/integración (watch) |
| `npm run test:run` | Ejecutar tests unitarios/integración (single run) |
| `npm run test:e2e` | Ejecutar tests end-to-end con Playwright |
| `npm run lint` | Ejecutar ESLint |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:push` | Sincronizar schema con la base de datos |
| `npm run db:migrate` | Crear y aplicar migraciones |
| `npm run db:seed` | Insertar datos de prueba |
| `npm run db:studio` | Abrir Prisma Studio |

## Licencia

Este proyecto es software privado. Todos los derechos reservados.
