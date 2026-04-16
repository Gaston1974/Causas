# Endpoints de la API - Sistema de Causas

## Configuración Base
- **URL Base**: `http://10.50.22.142:8080/v1`
- **Autenticación**: Header `Authorization` con token

## Endpoints Implementados

### 1. LOGIN
```
POST /login
Content-Type: application/json
Body: { email, password, twoFactor? }
```

### 2. ALTAS (Crear)
```
POST /altas
Authorization: [token]
Content-Type: application/json
Body: data_altaCausa.json | data_altaUsuario.json | data_altaPreventor.json | data_altaFiscalia.json | data_altaJuzgado.json
```

### 3. BAJAS (Eliminar)
```
POST /bajas
Authorization: [token]
Content-Type: application/json
Body: data_bajaCausa.json | data_bajaUsuario.json | data_bajaPreventor.json | data_bajaJuzgado.json | data_bajaFiscalia.json
```

### 4. CONSULTAS
```
POST /causas
Authorization: [token]
Content-Type: application/json
Body: data_consultaCausas.json (opcional)

POST /usuarios
Authorization: [token]
Content-Type: application/json
Body: data_consultaUsuario.json (opcional)

POST /causas/historico
Authorization: [token]
Content-Type: application/json
Body: data_consultaHistorico.json
```

### 5. COMBOS (GET)
```
GET /combos/provincias
Authorization: [token]

GET /combos/localidades
Authorization: [token]

GET /combos/fiscalias
Authorization: [token]

GET /combos/juzgados
Authorization: [token]

GET /combos/preventores
Authorization: [token]
```

### 6. ACTUALIZACIONES
```
POST /updates
Authorization: [token]
Content-Type: application/json
Body: data_updateUsuario.json | data_updateCausa.json
```

## Archivos Actualizados

1. **frontend/lib/api.ts** - Cliente API centralizado
2. **frontend/contexts/auth-context.tsx** - Contexto de autenticación
3. **frontend/hooks/use-causas.ts** - Hook actualizado para usar API real
4. **frontend/app/secure-login.tsx** - Login con endpoints reales
5. **frontend/app/simple-login.tsx** - Registro de usuarios
6. **frontend/types/api.ts** - Tipos TypeScript para respuestas
7. **frontend/app/layout.tsx** - AuthProvider agregado
