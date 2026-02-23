# designpro-api

API base de orquestación para DesignPro (sin generador real todavía).

## Estado actual
- Contrato de jobs implementado.
- Procesamiento stub en memoria (`queued -> processing -> done`).
- Catálogos base para tipos de estructura, formatos y prioridades.

## Endpoints
- `GET /health`
- `GET /designpro/catalogs`
- `GET /designpro/jobs?status=&requesterId=&limit=`
- `POST /designpro/jobs`
- `GET /designpro/jobs/:id`
- `GET /designpro/jobs/:id/result`

## Crear job (ejemplo)

```json
POST /designpro/jobs
{
  "type": "structure_generate",
  "priority": "normal",
  "requesterId": "usr_123",
  "source": "portal",
  "projectId": "proj_001",
  "projectName": "Línea Ensamble A",
  "params": {
    "structureType": "rack-selectivo",
    "levels": 4,
    "bayWidthMm": 2700
  }
}
```

## Notas
- Este servicio hoy no ejecuta FreeCAD/Blender.
- Está diseñado para conectar después un worker real.
- Persistencia actual: memoria del proceso (reiniciar limpia datos).
