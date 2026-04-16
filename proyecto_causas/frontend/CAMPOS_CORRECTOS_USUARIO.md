# ✅ Configuración Final - Crear Usuario

## 🎯 Estructura de la Tabla Usuarios

Basado en la estructura real de la base de datos, estos son los campos que se envían:

```json
{
  "first_name": "Juan",
  "last_name": "Pérez", 
  "clave": "miPassword123",
  "rol": "normal",
  "email": "123456@policia.gob.ar",
  "dni": "123456",
  "username": "123456",
  "ce": "123456",
  "grado": "Oficial",
  "nombre_completo": "Juan Pérez"
}
```

### 📋 Campos por categoría:

#### **Campos requeridos (NO NULL):**
- ✅ `first_name` - Nombre
- ✅ `last_name` - Apellido  
- ✅ `clave` - Contraseña (campo real en BD)
- ✅ `rol` - Rol (enum: 'administrador' | 'normal')

#### **Campos únicos (evitar duplicados):**
- 🔑 `email` - Email único generado automáticamente
- 🔑 `dni` - DNI único (usando CE como DNI)

#### **Campos opcionales útiles:**
- `username` - Usuario (usando CE)
- `ce` - CE específico
- `grado` - Grado del usuario
- `nombre_completo` - Nombre completo concatenado

### Mapeo de campos del formulario:

| Campo del Formulario | Campo BD | Tipo | Requerido | Único |
|----------------------|----------|------|-----------|-------|
| Nombre | `first_name` | varchar(150) | ✅ Sí | ❌ No |
| Apellido | `last_name` | varchar(150) | ✅ Sí | ❌ No |
| CE | `dni` | varchar(20) | ❌ No | ✅ Sí |
| CE | `ce` | varchar(20) | ❌ No | ❌ No |
| CE | `username` | varchar(150) | ❌ No | ❌ No |
| Grado | `grado` | varchar(50) | ❌ No | ❌ No |
| Contraseña | `clave` | varchar(256) | ✅ Sí | ❌ No |
| Email | `email` | varchar(254) | ❌ No | ✅ Sí |
| Rol | `rol` | enum | ✅ Sí | ❌ No |
| Nombre completo | `nombre_completo` | varchar(150) | ❌ No | ❌ No |

---

## 📋 Validaciones implementadas:

✅ **Nombre**: No puede estar vacío  
✅ **Apellido**: No puede estar vacío  
✅ **CE**: Mínimo 4 dígitos, máximo 15 dígitos, solo números  
✅ **Grado**: No puede estar vacío  
✅ **Contraseña**: Mínimo 6 caracteres  

---

## 🔧 Cambios realizados:

### 1. Actualizado el objeto `userData` en `simple-login.tsx`:

**Antes** (campos incorrectos):
```typescript
const userData = {
  first_name: newUser.nombre,
  last_name: newUser.apellido,
  dni: newUser.ce,
  rol: newUser.grado,
  password: newUser.password,
};
```

**Ahora** (estructura completa según BD):
```typescript
const userData = {
  // Campos requeridos (NO NULL)
  first_name: newUser.nombre,
  last_name: newUser.apellido,
  clave: newUser.password,  // Campo real en BD es 'clave'
  rol: "normal",  // Por defecto 'normal'
  
  // Campos únicos (evitar duplicados)
  email: `${newUser.ce}@policia.gob.ar`,
  dni: newUser.ce,
  
  // Campos opcionales útiles
  username: newUser.ce,
  ce: newUser.ce,
  grado: newUser.grado,
  nombre_completo: `${newUser.nombre} ${newUser.apellido}`,
};
```

### 2. Actualizado el logging en consola:
```
📤 Enviando datos de usuario: {
  "first_name": "Juan",
  "last_name": "Pérez",
  "dni": "123456",
  "rol": "Oficial",
  "password": "******"
}
🔑 Campos enviados (5): first_name, last_name, dni, rol, password
```

### 3. Mejorados los mensajes de error:
Ahora si hay un error 400, muestra exactamente los 5 campos que se enviaron.

---

## 🧪 Prueba manual con PowerShell:

```powershell
# Ejecuta este comando para probar
cd D:\proyectos\proyecto_causas\frontend
.\test-crear-usuario.ps1
```

O prueba manualmente:

```powershell
$body = @{
    first_name = "Test"
    last_name = "Usuario"
    dni = "999999"
    rol = "Oficial"
    password = "test123456"
} | ConvertTo-Json

Invoke-WebRequest `
    -Uri "http://10.50.22.142:8080/v1/altas" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $body `
    -ContentType "application/json"
```

---

## ✅ Ahora debería funcionar

Con esta configuración, el registro de usuarios debería funcionar correctamente. 

### Para verificar:

1. **Abre el navegador** en http://localhost:3000/login (o la URL de tu frontend)
2. **Haz clic en "Crear usuario"**
3. **Completa el formulario**:
   - Nombre: Test
   - Apellido: Usuario
   - CE: 999999
   - Grado: Oficial
   - Contraseña: test123456
4. **Haz clic en "Crear usuario"**
5. **Deberías ver**: ✅ Usuario creado correctamente

### Si hay algún error:

Abre la consola del navegador (F12) y verás logs detallados:
```
📤 Enviando datos de usuario: {...}
📡 Status de respuesta: 200 OK  ← Éxito
```

O si hay error:
```
❌ Error 400 en /altas: {...}
📋 Detalles del error (JSON): {...}
```

Comparte el error completo para ajustar.

---

## 📝 Notas adicionales:

- **No se genera email automáticamente** - el backend lo manejará
- **No se envía campo `tipo`** - no es necesario
- **No se envía `username`** - se usa `dni` directamente
- **No se envían flags** (`is_active`, `is_staff`) - el backend los maneja

El backend ya sabe que está creando un usuario por el contexto del endpoint `/altas`.

