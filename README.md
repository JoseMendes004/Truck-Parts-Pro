<div align="center">

# TruckParts Pro

### Plataforma E-Commerce de Repuestos para Camiones

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> Una plataforma completa de comercio electronico para la distribucion y venta de repuestos para camiones, con panel de administracion avanzado, personalizacion de temas en tiempo real y gestion de inventario.

</div>

---

## Tabla de Contenidos

- [Vista General](#-vista-general)
- [Caracteristicas](#-caracteristicas)
- [Tech Stack](#-tech-stack)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Comenzar](#-comenzar)
- [Credenciales de Demo](#-credenciales-de-demo)
- [Panel de Administracion](#-panel-de-administracion)
- [Temas y Personalizacion](#-temas-y-personalizacion)
- [Scripts Disponibles](#-scripts-disponibles)
- [Capturas de Pantalla](#-capturas-de-pantalla)

---

## Vista General

**TruckParts Pro** es una plataforma e-commerce moderna y completa, disenada para la comercializacion de repuestos para camiones. Construida sobre **Next.js 16** con **React 19**, combina un diseno glassmorphism elegante con funcionalidad enterprise.

La plataforma incluye:
- **Tienda publica** para clientes con catalogo de productos, carrito de compras y checkout
- **Panel de administracion** completo con gestion de inventario, facturacion y personalizacion visual
- **Sistema de temas** en tiempo real con soporte para modo oscuro, claro y daltonismo

---

## Caracteristicas

### Para Clientes

| Caracteristica | Descripcion |
|---|---|
| **Catalogo de Productos** | Explora repuestos con imagenes, valoraciones y precios |
| **Carrito de Compras** | Agrega, elimina y gestiona productos con calculo automatico de totales |
| **Busqueda y Filtros** | Encuentra repuestos por nombre, categoria, marca o tipo de vehiculo |
| **Modo Oscuro / Claro** | Interfaz adaptable a las preferencias del usuario |
| **Accesibilidad** | Modo daltonismo y componentes con ARIA compliant |
| **Diseno Responsivo** | Experiencia optimizada para movil, tablet y escritorio |

### Para Administradores

| Caracteristica | Descripcion |
|---|---|
| **Gestion de Inventario** | Agregar, editar y eliminar productos con imagenes y precios |
| **Facturacion** | Generacion e impresion de facturas en formato venezolano (RIF, SENIAT) |
| **Personalizacion de Colores** | Control total de colores primarios, acentos, fondo y texto |
| **Gestion de Tipografia** | Cambio de fuentes para titulos y cuerpo de texto con tamanos |
| **Vista Previa en Tiempo Real** | Visualiza cambios de tema antes de aplicarlos |
| **Estadisticas** | Dashboard con graficos de ventas y metricas clave (Recharts) |

---

## Tech Stack

### Core

```
Next.js 16.1     →  Framework React con App Router
React 19         →  Biblioteca UI con soporte a Concurrent Features
TypeScript 5.7   →  Tipado estatico y seguridad de tipos
```

### UI & Estilos

```
Tailwind CSS 4.2   →  Utilidades CSS con PostCSS
Radix UI           →  40+ componentes primitivos accesibles
shadcn/ui          →  57 componentes pre-estilizados sobre Radix
Lucide React       →  Iconografia moderna y consistente
Next Themes        →  Gestion de temas claro/oscuro
```

### Formularios & Validacion

```
React Hook Form 7.54   →  Gestion de formularios ligera y eficiente
Zod 3.24               →  Esquemas de validacion TypeScript-first
@hookform/resolvers    →  Integracion entre RHF y Zod
```

### Componentes Especializados

```
Recharts 2.15          →  Graficos y visualizacion de datos
Sonner 1.7             →  Notificaciones toast elegantes
Embla Carousel         →  Carrusel de productos con swipe
Vaul 1.1               →  Drawer/panel lateral para movil
cmdk 1.1               →  Paleta de comandos
React Day Picker 9.13  →  Selector de fechas accesible
```

### Infraestructura

```
Vercel Analytics   →  Metricas de uso y rendimiento
Google Fonts       →  Tipografia Geist / Geist Mono
LocalStorage       →  Persistencia de sesion y carrito
```

---

## Estructura del Proyecto

```
TruckPartsPro/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout raiz con providers
│   ├── page.tsx                  # Pagina principal (redireccion logica)
│   ├── login/                    # Pagina de inicio de sesion
│   │   └── page.tsx              # UI glassmorphism con credenciales demo
│   ├── dashboard/                # Dashboard autenticado
│   │   └── page.tsx              # Hero, carrusel de productos, servicios
│   └── admin/                    # Panel de administracion
│       ├── page.tsx              # Layout con sidebar de navegacion
│       └── _sections/            # Secciones del admin
│           ├── ColoresSection.tsx
│           ├── TypographySection.tsx
│           └── PreviewSection.tsx
│
├── components/                   # Componentes reutilizables
│   ├── ui/                       # 57 componentes shadcn/Radix UI
│   ├── header.tsx                # Navegacion con carrito
│   ├── hero-banner.tsx           # Banner marketing con video
│   ├── products-carousel.tsx     # Carrusel de 6+ productos
│   ├── services-section.tsx      # Seccion de servicios
│   ├── footer.tsx                # Pie de pagina
│   ├── admin-inventory.tsx       # Tabla de inventario admin
│   ├── admin-factura.tsx         # Modulo de facturas
│   ├── checkout-dialog.tsx       # Dialog de checkout
│   ├── theme-provider.tsx        # Proveedor de temas
│   └── font-applier.tsx          # Aplicador de fuentes custom
│
├── contexts/                     # Estado global (React Context)
│   ├── auth-context.tsx          # Autenticacion y roles de usuario
│   ├── cart-context.tsx          # Estado del carrito de compras
│   └── theme-context.tsx         # Temas, colores y tipografia
│
├── hooks/                        # Custom React Hooks
├── lib/
│   └── utils.ts                  # Utilidades (cn, classnames)
│
├── public/                       # Assets estaticos
│   ├── camion.mp4                # Video background principal
│   ├── nuevo_camion.mp4          # Video background alternativo
│   ├── logo.png                  # Logo de la plataforma
│   └── products/                 # Imagenes de productos
│
├── styles/
│   └── globals.css               # Estilos globales y variables CSS
│
├── components.json               # Configuracion shadcn/ui
├── next.config.mjs               # Configuracion Next.js
├── tailwind.config.ts            # Configuracion Tailwind
└── tsconfig.json                 # Configuracion TypeScript
```

---

## Comenzar

### Requisitos Previos

- **Node.js** >= 18.0
- **npm** >= 9.0 o equivalente

### Instalacion

```bash
# 1. Clona el repositorio
git clone https://github.com/JoseMendes004/TruckPartsPro.git
cd TruckPartsPro

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Produccion

```bash
# Construir la aplicacion
npm run build

# Iniciar servidor de produccion
npm start
```

---

## Credenciales de Demo

La plataforma incluye dos cuentas de demostracion para explorar todas las funcionalidades:

| Rol | Email | Contrasena | Acceso |
|---|---|---|---|
| **Usuario** | `usuario@truckparts.com` | `usuario123` | Dashboard, catalogo, carrito |
| **Administrador** | `admin@truckparts.com` | `admin123` | Todo lo anterior + panel admin |

> La autenticacion es simulada con un delay de 800ms para una experiencia realista. Los datos se persisten en `localStorage`.

---

## Panel de Administracion

El panel de administracion (`/admin`) incluye:

### Inventario
- Lista completa de productos con imagen, precio, stock y calificacion
- Formulario para agregar nuevos productos (nombre, marca, precio, imagen, tamano, tipo de vehiculo)
- Edicion y eliminacion en linea
- Opciones de cantidad personalizables

### Facturacion
- Generacion de facturas con formato venezolano
- Campos: RIF, SENIAT, fecha, productos, IVA
- Impresion directa desde el navegador

### Personalizacion Visual
- **Colores**: Control de color primario, acento, fondo y texto
- **Tipografia**: Seleccion de fuentes para titulos y cuerpo con tamanos
- **Vista previa en tiempo real**: Los cambios se reflejan instantaneamente

---

## Temas y Personalizacion

TruckParts Pro soporta tres modos visuales:

```
Modo Oscuro      →  Predeterminado, diseño oscuro elegante
Modo Claro       →  Interfaz clara y limpia
Modo Daltonismo  →  Paleta accesible para daltonismo
```

Las variables de tema se gestionan mediante **CSS Custom Properties** y el contexto de React `ThemeContext`. El administrador puede cambiar:

- Colores en tiempo real desde el panel admin
- Fuentes de titulos y cuerpo de texto
- Tamanos tipograficos

---

## Scripts Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con Webpack en `localhost:3000` |
| `npm run build` | Genera el build de produccion optimizado |
| `npm start` | Inicia el servidor de produccion |
| `npm run lint` | Ejecuta ESLint para analisis estatico del codigo |

---

## Estado del Proyecto

| Modulo | Estado |
|---|---|
| Pagina de Login | Completado |
| Dashboard de Usuario | Completado |
| Carrito de Compras | Completado |
| Catalogo de Productos | Completado |
| Panel de Administracion | Completado |
| Gestion de Inventario | Completado |
| Facturacion | Completado |
| Personalizacion de Temas | Completado |
| Backend / Base de Datos | En desarrollo |
| Autenticacion real (JWT) | En desarrollo |
| Pagos en linea | Planificado |

---

## Autor

**Jose Mendes**

- GitHub: [@JoseMendes004](https://github.com/JoseMendes004)

---

<div align="center">

Hecho con dedicacion para la industria del transporte pesado.

**TruckParts Pro** — *Repuestos de calidad, tecnologia de vanguardia.*

</div>
