# Railway deploy - portal-api

`portal-api` oficial vive en:
- `apps/portal-api`

## Configuración recomendada (Railway service)
- Root Directory: `apps/portal-api`
- Install Command: `npm install`
- Build Command: `npm run prisma:generate`
- Start Command: `npm run start`

## Variables mínimas
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `CORS_ORIGIN`
- `PORT` (opcional, Railway lo inyecta)

## Migraciones
Después de configurar DB, correr una vez:
- `npm run prisma:deploy`

> Mantener `backend/` temporalmente solo por compatibilidad. El backend oficial es `apps/portal-api`.
