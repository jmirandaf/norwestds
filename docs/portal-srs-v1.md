# Portal NDS + DesignPro - SRS v1

## 1) Roles
- admin: acceso total
- pm: acceso a clientes/proyectos asignados
- client: acceso exclusivo a su cuenta y proyectos

## 2) Campos obligatorios (projects)
- title
- clientId
- pmId
- status
- progressPct
- startDate
- dueDate
- priority
- riskLevel

## 3) Estados estándar de proyecto
- planned
- active
- on-hold
- completed
- cancelled

## 4) Hitos estándar de schedule
- ingenieria
- procurement
- fabricacion
- integracion
- fat_sat
- cierre

## 5) Flujo DesignPro (negocio)
1. cliente captura configuración
2. sistema genera preview/render
3. se guarda solicitud
4. PM revisa y comenta
5. se emite cotización final

## 6) Política de invitaciones
- alta solo por admin
- token de un solo uso
- expiración default: 72h
