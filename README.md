# Sistema de Gestión Hospitalaria

Sistema web para la gestión integral de procesos hospitalarios, desarrollado como proyecto del programa **ADSO** del **SENA CEET**. Permite administrar pacientes, médicos, visitas médicas, tratamientos, fórmulas, exámenes e incapacidades desde un dashboard centralizado con autenticación segura y actualizaciones en tiempo real.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Lenguaje | TypeScript 5 |
| Base de datos | PostgreSQL via Supabase |
| Autenticación | Supabase Auth (sesiones con cookies) |
| Estilos | Tailwind CSS 4 |
| Validación | Zod 4 |
| Iconos | Lucide React |
| Componentes UI | Radix UI (Dialog, Select, Tabs) |
| Fechas | date-fns 4 |
| Notificaciones | React Hot Toast |

---

## Requisitos previos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) con un proyecto creado

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd gestion_hospitalaria

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de Supabase (ver sección de variables)

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Las variables `NEXT_PUBLIC_*` son accesibles desde el cliente. `SUPABASE_SERVICE_ROLE_KEY` solo se usa en el servidor y nunca se expone al navegador.

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (webpack)
npm run build    # Build de producción
npm start        # Iniciar servidor de producción
npm run lint     # Verificar código con ESLint
```

---

## Estructura del proyecto

```
gestion_hospitalaria/
├── proxy.ts                        # Middleware global de autenticación (Next.js 16)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz (fuentes, toasts globales)
│   │   ├── globals.css             # Estilos globales (Tailwind)
│   │   ├── page.tsx                # Landing page
│   │   ├── login/                  # Página de inicio de sesión
│   │   ├── registro/               # Página de registro
│   │   ├── auth/
│   │   │   ├── actions.ts          # Server action de cierre de sesión
│   │   │   └── callback/           # Callback OAuth de Supabase
│   │   └── dashboard/
│   │       ├── layout.tsx          # Layout del dashboard (auth guard)
│   │       ├── page.tsx            # Dashboard principal con KPIs
│   │       ├── pacientes/
│   │       ├── medicos/
│   │       ├── especialidades/
│   │       ├── hospitales/
│   │       ├── medicamentos/
│   │       ├── visitas/
│   │       │   └── nueva/          # Formulario de nueva visita
│   │       ├── tratamientos/
│   │       ├── formulas/
│   │       ├── examenes/
│   │       └── incapacidades/
│   ├── modules/                    # Lógica de negocio por dominio
│   │   ├── pacientes/
│   │   ├── medicos/
│   │   ├── especialidades/
│   │   ├── hospitales/
│   │   ├── medicamentos/
│   │   ├── visitas/
│   │   ├── tratamientos/
│   │   ├── formulas/
│   │   ├── examenes/
│   │   └── incapacidades/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── sidebar.tsx         # Barra lateral de navegación
│   │   │   └── DashHeader.tsx      # Header con usuario y cerrar sesión
│   │   └── ui/
│   │       └── RealtimeVisitasDashboard.tsx  # Widget de visitas en tiempo real
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Cliente Supabase para el navegador
│   │   │   ├── server.ts           # Cliente Supabase para el servidor
│   │   │   └── middleware.ts       # Cliente Supabase para middleware
│   │   ├── interfaces/
│   │   │   └── repository.interface.ts  # Interfaces base del patrón repositorio
│   │   └── utils/
│   │       └── utils.ts
│   └── types/
│       └── database.types.ts       # Tipos generados por Supabase CLI
```

---

## Arquitectura de módulos

Cada módulo de negocio (`pacientes`, `medicos`, `visitas`, etc.) sigue una arquitectura en capas consistente:

```
modules/<nombre>/
├── types.ts          # Interfaces de dominio, DTOs y filtros
├── repository.ts     # Acceso a datos (implementa IRepository)
├── service.ts        # Lógica de negocio y validaciones
├── schema.ts         # Esquemas Zod para validación de formularios
└── actions.ts        # Server Actions de Next.js (mutaciones desde el cliente)
```

### Interfaces del repositorio

Todos los repositorios implementan las siguientes interfaces genéricas:

```typescript
IRepository<T, ID, C>        // CRUD completo: findById, findAll, create, update, delete
IPaginableRepository<T, F>   // Paginación: findPaginated(page, pageSize, filters)
```

El resultado estándar de los servicios usa:

```typescript
ServiceResult<T>  // { data, error, success }
PageResult<T>     // { data[], count, page, pageSize, totalPages }
```

---

## Módulos disponibles

| Módulo | Ruta | Descripción |
|---|---|---|
| Dashboard | `/dashboard` | KPIs generales y visitas recientes en tiempo real |
| Pacientes | `/dashboard/pacientes` | Registro y gestión de pacientes |
| Médicos | `/dashboard/medicos` | Registro y gestión de médicos |
| Especialidades | `/dashboard/especialidades` | Catálogo de especialidades médicas |
| Hospitales | `/dashboard/hospitales` | Gestión de hospitales |
| Medicamentos | `/dashboard/medicamentos` | Catálogo de medicamentos |
| Visitas | `/dashboard/visitas` | Registro de visitas médicas con signos vitales |
| Tratamientos | `/dashboard/tratamientos` | Tratamientos asociados a visitas |
| Fórmulas | `/dashboard/formulas` | Fórmulas médicas con detalle de medicamentos |
| Exámenes | `/dashboard/examenes` | Órdenes de exámenes médicos |
| Incapacidades | `/dashboard/incapacidades` | Registro de incapacidades médicas |

---

## Esquema de base de datos

La base de datos en Supabase (PostgreSQL) contiene las siguientes tablas principales:

```
pacientes          → Información demográfica del paciente
medicos            → Médicos con especialidad y hospital asociado
especialidades     → Catálogo de especialidades médicas
hospitales         → Información de hospitales
medicamentos       → Catálogo de medicamentos
visitas            → Consultas médicas (paciente + médico + fecha/hora)
detallesvisitas    → Diagnóstico y motivo por visita
signosvitales      → Temperatura, presión, frecuencias, saturación O₂
tratamientos       → Curso de tratamiento derivado de una visita
formulas           → Recetas médicas asociadas a tratamientos
detallesformulas   → Medicamentos, posología y periodo de cada fórmula
orden_examenes     → Órdenes de examen por visita
detallesexamenes   → Nombre, tipo e indicaciones de cada examen
incapacidades      → Incapacidades médicas asociadas a tratamientos
detallesincapacidades → Periodo, días y descripción de la incapacidad
```

---

## Autenticación

El sistema usa **Supabase Auth** con sesiones administradas por cookies (SSR):

- `proxy.ts` — Middleware que se ejecuta en cada petición, refresca la sesión y protege las rutas del dashboard.
- Rutas públicas: `/`, `/login`, `/registro`, `/auth/*`
- Rutas protegidas: todo bajo `/dashboard` (redirige a `/login` si no hay sesión)
- Los usuarios autenticados que visitan `/login` son redirigidos automáticamente al dashboard.

---

## Tiempo real

El widget **Visitas Recientes** del dashboard usa **Supabase Realtime** (`postgres_changes`) para mostrar nuevas visitas al instante sin recargar la página, con un indicador visual del estado de conexión.

---

## Alias de importación (TypeScript)

```typescript
@lib/*        → src/lib/*
@components/* → src/components/*
@modules/*    → src/modules/*
```

---

## Licencia

Proyecto académico — SENA CEET · Programa ADSO.
