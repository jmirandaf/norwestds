# NorwestDS Web - Project Documentation (v1)

## 1. Objetivo
Portal comercial + portal privado de clientes para proyectos y DesignPro by NDS.

## 2. Stack
- React + Vite
- Clerk Auth (frontend)
- Backend API (Node/Express + Prisma)
- Netlify deploy + Netlify functions (correo)

## 3. Rutas principales
### Públicas
- `/`, `/services`, `/projects`, `/about`, `/team`, `/contact`, `/training`
- `/login`, `/forgot-password`

### Privadas (portal)
- `/portal`
- `/portal/projects`
- `/portal/schedule`
- `/portal/designpro`
- `/portal/admin/invites` (solo admin)

## 4. Auth y roles
- `AuthContext`: sesión, userData, login/logout/reset
- `ProtectedRoute`: controla acceso por roles
- Roles: `admin`, `pm`, `client`

## 5. Módulos portal
- `PortalHome`: KPIs reales (proyectos activos, % avance, hitos)
- `PortalProjects`: lista proyectos con validación de campos requeridos
- `PortalSchedule`: hitos y validación contra estándar
- `PortalDesignPro`: UI interactiva tipo configurador + llamada API
- `PortalInvites`: creación de invitaciones (admin)

## 6. Integración DesignPro API
- Servicio: `src/services/designProService.js`
- Env: `VITE_DESIGNPRO_API_BASE`
- Flujo: formulario -> `POST /generate` -> render + STEP

## 7. Configuración y estándares
- `src/config/portalStandards.js`
  - estados proyecto
  - hitos schedule
  - roles
  - campos requeridos
  - flujo DesignPro
  - expiración invitaciones

## 8. Persistencia de datos
- Base de datos vía backend con Prisma (`backend/prisma/schema.prisma`)
- API de portal en `backend/src/routes/portal.js`

## 9. Operación
- Build local: `npm run build`
- Deploy: push a `main` (Netlify build automático)

## 10. Pendientes prioritarios
1. Consumir API real de invitaciones (token one-time + aceptación)
2. Pantallas detalle de proyecto (timeline y updates)
3. Persistencia de solicitudes DesignPro por proyecto
4. Descarga controlada de STEP por cliente
5. Optimización bundle (code splitting)
