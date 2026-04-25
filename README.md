# EcoMart

Aplicacion e-commerce con arquitectura separada:

- `Backend`: API REST con Express + TypeScript + Prisma + MySQL
- `Frontend`: React + TypeScript + Vite

## Requisitos

- Node.js 20+
- npm 10+
- MySQL en ejecucion

## Estructura del proyecto

```text
EcoMart/
|- Backend/
|- Frontend/
```

## Configuracion de variables de entorno

### Backend (`Backend/.env`)

Variables requeridas:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/ecoMart"
JWT_SECRET="tu_clave_secreta"
PORT=3000
```

Notas:

- `JWT_SECRET` es obligatoria para poder iniciar sesion (`/user/login`).
- Si no defines `PORT`, el backend usa `3000` por defecto.

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/
```

## Instalacion de dependencias

Desde la raiz del proyecto:

```bash
cd Backend && npm install
cd ../Frontend && npm install
```

## Preparar base de datos (Prisma)

En `Backend/`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Ejecutar en desarrollo

Abre 2 terminales.

### Terminal 1: Backend

```bash
cd Backend
npm run dev
```

Servidor backend: `http://localhost:3000`

### Terminal 2: Frontend

```bash
cd Frontend
npm run dev
```

Vite mostrara en consola la URL local (normalmente `http://localhost:5173`).

## Scripts disponibles

### Backend

- `npm run dev`: inicia el backend en modo desarrollo con `nodemon` + `tsx`
- `npm run build`: compila TypeScript a `dist/`
- `npm start`: ejecuta `dist/server.js`
- `npm run prod`: build + start
- `npm run prisma:generate`: genera cliente Prisma
- `npm run prisma:migrate`: ejecuta migraciones de Prisma

### Frontend

- `npm run dev`: inicia Vite en desarrollo
- `npm run build`: compila TypeScript y genera build de produccion
- `npm run preview`: sirve el build de produccion localmente
- `npm run lint`: ejecuta ESLint

## Endpoints actuales del backend

Base URL backend: `http://localhost:3000`

### Auth

- `POST /user/register`
- `POST /user/login`

### Productos

- `GET /producto`
- `GET /producto?nombre=camisa`
- `GET /producto?categoria=ROPA`
- `GET /producto?categorias=ROPA,HOGAR`
- `GET /producto/categorias`
- `POST /producto`

#### Body para crear producto

```json
{
	"nombre": "Camisa deportiva",
	"descripcion": "Camisa ligera para entrenar",
	"precio": 70000,
	"stock": 10,
	"categoria": "ROPA",
	"imagenUrl": "https://ejemplo.com/camisa.jpg"
}
```

Campos obligatorios: `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `imagenUrl`.

Valores permitidos para `categoria`: `ELECTRONICA`, `ROPA`, `HOGAR`, `DEPORTES`, `OTROS`.

## Flujo rapido de uso

1. Registrar usuario desde el frontend (`/register`).
2. Iniciar sesion (`/login`).
3. El frontend guarda el token JWT en `localStorage` y lo envia en `Authorization: Bearer <token>`.


## Estado actual del frontend

Pantallas implementadas:

- Login (`/` y `/login`)
- Registro (`/register`)

