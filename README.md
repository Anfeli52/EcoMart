# EcoMart

Guia minima para correr el proyecto (solo lo necesario).

## Requisitos

- Node.js 20+
- MySQL corriendo localmente

## 1) Entrar al backend

```bash
cd Backend
```

## 2) Instalar dependencias

```bash
npm install
```

## 3) Configurar base de datos

En `Backend/.env` debe existir:

```env
DATABASE_URL="mysql://root:root@localhost:3306/ecoMart"
```

## 4) Generar cliente de Prisma

```bash
npm run prisma:generate
```

## 5) Aplicar migraciones (primera vez o cuando cambie el schema)

```bash
npm run prisma:migrate
```

## 6) Levantar servidor

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

## Endpoint disponible

- `POST /user/register`

