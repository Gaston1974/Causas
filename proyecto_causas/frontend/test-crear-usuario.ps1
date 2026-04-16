# Script para probar la creación de usuarios
# Ejecuta: .\test-crear-usuario.ps1

Write-Host "🧪 Script de Prueba - Crear Usuario" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://10.50.22.142:8080/v1/altas"

# Función para probar una configuración
function Test-Configuracion {
    param(
        [string]$Nombre,
        [hashtable]$Body
    )
    
    Write-Host "🔄 Probando: $Nombre" -ForegroundColor Yellow
    
    $bodyJson = $Body | ConvertTo-Json -Depth 10
    Write-Host "📦 Enviando:" -ForegroundColor Gray
    Write-Host $bodyJson -ForegroundColor DarkGray
    
    try {
        $response = Invoke-WebRequest `
            -Uri $baseUrl `
            -Method POST `
            -Headers @{"Content-Type" = "application/json"} `
            -Body $bodyJson `
            -ContentType "application/json"
        
        Write-Host "✅ ÉXITO con $Nombre" -ForegroundColor Green
        Write-Host "📥 Respuesta:" -ForegroundColor Green
        Write-Host $response.Content -ForegroundColor Green
        Write-Host ""
        return $true
        
    } catch {
        Write-Host "❌ Error con $Nombre" -ForegroundColor Red
        Write-Host "Status Code:" $_.Exception.Response.StatusCode.value__ -ForegroundColor Red
        
        if ($_.Exception.Response) {
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errorBody = $reader.ReadToEnd()
                Write-Host "Mensaje del servidor:" -ForegroundColor Red
                Write-Host $errorBody -ForegroundColor DarkRed
            } catch {
                Write-Host "No se pudo leer el mensaje de error" -ForegroundColor Red
            }
        }
        Write-Host ""
        return $false
    }
}

# ===================================================================
# CONFIGURACIÓN 1: Solo campos esenciales (sin rol, email, dni, username)
# ===================================================================
$config1 = @{
    first_name = "Test"
    last_name = "Usuario1"
    clave = "test123456"
    ce = "999991"
    grado = "Oficial"
    nombre_completo = "Test Usuario1"
}

# ===================================================================
# CONFIGURACIÓN 2: Solo campos requeridos mínimos
# ===================================================================
$config2 = @{
    first_name = "Test"
    last_name = "Usuario2"
    clave = "test123456"
}

# ===================================================================
# CONFIGURACIÓN 3: Con campos adicionales
# ===================================================================
$config3 = @{
    first_name = "Test"
    last_name = "Usuario3"
    clave = "test123456"
    ce = "999993"
    grado = "Oficial"
}

# ===================================================================
# CONFIGURACIÓN 4: Solo nombre completo
# ===================================================================
$config4 = @{
    first_name = "Test"
    last_name = "Usuario4"
    clave = "test123456"
    nombre_completo = "Test Usuario4"
}

# Probar cada configuración
Write-Host "Probando diferentes configuraciones de campos..." -ForegroundColor Cyan
Write-Host ""

$exito1 = Test-Configuracion -Nombre "CONFIGURACIÓN 1 (Completa)" -Body $config1
if ($exito1) { 
    Write-Host "🎉 La CONFIGURACIÓN 1 funciona! Esta es la que usa el frontend." -ForegroundColor Green
    Write-Host "Campos: first_name, last_name, clave, ce, grado, nombre_completo" -ForegroundColor Yellow
    exit 0 
}

$exito2 = Test-Configuracion -Nombre "CONFIGURACIÓN 2 (Mínima)" -Body $config2
if ($exito2) { 
    Write-Host "🎉 La CONFIGURACIÓN 2 funciona! Solo campos requeridos." -ForegroundColor Green
    Write-Host "Campos: first_name, last_name, clave" -ForegroundColor Yellow
    exit 0 
}

$exito3 = Test-Configuracion -Nombre "CONFIGURACIÓN 3 (Con CE y grado)" -Body $config3
if ($exito3) { 
    Write-Host "🎉 La CONFIGURACIÓN 3 funciona! Con CE y grado." -ForegroundColor Green
    Write-Host "Campos: first_name, last_name, clave, ce, grado" -ForegroundColor Yellow
    exit 0 
}

$exito4 = Test-Configuracion -Nombre "CONFIGURACIÓN 4 (Con nombre completo)" -Body $config4
if ($exito4) { 
    Write-Host "🎉 La CONFIGURACIÓN 4 funciona! Con nombre completo." -ForegroundColor Green
    Write-Host "Campos: first_name, last_name, clave, nombre_completo" -ForegroundColor Yellow
    exit 0 
}

Write-Host ""
Write-Host "❌ Ninguna configuración funcionó" -ForegroundColor Red
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Copia los mensajes de error de arriba" -ForegroundColor Yellow
Write-Host "2. Compártelos para ajustar los campos correctos" -ForegroundColor Yellow
Write-Host "3. O verifica la documentación del backend" -ForegroundColor Yellow
Write-Host ""

