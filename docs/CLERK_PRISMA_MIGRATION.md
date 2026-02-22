# Migración a Clerk + PostgreSQL + Prisma

## Frontend (ya migrado)
- Auth UI con Clerk (`/login`, `/register`)
- `AuthContext` ahora usa Clerk
- Portal ya consume API backend (`/api/portal/*`)

Variables en frontend (`.env`):
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL`
- `VITE_DESIGNPRO_API_BASE` (opcional si usas API separada)

## Backend (nuevo)
Ruta: `backend/`

Variables en backend (`backend/.env`):
- `PORT=8787`
- `DATABASE_URL=...`
- `CLERK_SECRET_KEY=...`
- `FRONTEND_URL=http://localhost:5173`

## Levantar backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Endpoints listos
- `GET /health`
- `GET /api/portal/projects`
- `GET /api/portal/schedules`
- `POST /api/portal/invites` (solo admin)

## Roles
Se usan `admin`, `pm`, `client` desde `publicMetadata.role` en Clerk.

Ejemplo en Clerk (user public metadata):
```json
{ "role": "admin" }
```
