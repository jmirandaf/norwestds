# Monorepo structure (norwestds)

## Apps
- `apps/portal-api` (destino de migración del backend actual `backend/`)
- `apps/designpro-api` (API de jobs/catálogos/resultados)
- `apps/designpro-worker` (ejecución de jobs pesados)

## Shared
- `packages/shared` para tipos, validadores y utilidades compartidas.

## Infra
- `infra/railway` para plantillas y notas de despliegue.

## Nota de transición
No se movió el backend actual para evitar romper flujo; la migración puede hacerse por etapas.
