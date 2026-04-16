@echo off
title Sistema Causas - Panel de Arranque de Produccion
color 0b

echo ========================================================
echo       INICIALIZACION DEL SISTEMA CAUSAS (MODO PROD)
echo ========================================================
echo.

:: 1. Chequeamos si PM2 esta instalado
call pm2 -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] PM2 no esta instalado. Instalando gestor globalmente...
    call npm install -g pm2
    echo [ok] PM2 Instalado.
) else (
    echo [ok] PM2 detectado en el sistema.
)
echo.

:: 2. Matar cualquier instancia vieja para arrancar en limpio
echo [x] Limpiando procesos viejos...
call pm2 delete all >nul 2>&1

:: 3. Arrancar el ecosistema (Frontend + Backend)
echo [\] Iniciando Backend y Frontend en paralelo...
call pm2 start ecosystem.config.js

:: 4. Guardar configuracion de PM2
call pm2 save >nul 2>&1

echo.
echo ========================================================
echo  SISTEMA LEVANTADO. NextJs (3000) y FastAPI (8080)
echo ========================================================
echo.
echo Quedaras conectado al Monitor del Sistema. Para salir aprieta "q".
echo.
pause
call pm2 monit
