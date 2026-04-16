# Backend FastAPI - Sistema de Causas

Este backend en **Python / FastAPI** reemplaza gradualmente al backend en Go (`Libros`) y es compatible con el frontend Next.js del proyecto de causas.

## 1. Requisitos

- Python 3.11+ instalado en la VM
- Acceso a MySQL/MariaDB con la misma base que usa hoy tu backend Go

## 2. Estructura

```text
backend/
  app/
    main.py
    core/
      config.py
    db/
      session.py
      models.py
    schemas.py
    api/
      v1/
        routes_login.py
        routes_causas.py
        routes_misc.py
  requirements.txt
  README.md
```

Los endpoints expuestos (prefijo `/v1`) son compatibles con lo que espera el frontend:

- `POST /v1/login`
- `POST /v1/causas`
- `GET  /v1/combos/provincias` (y otros combos de ejemplo)

## 3. Configuración (.env)

En la carpeta `backend/` crea un archivo `.env` con el contenido adecuado para tu VM y base de datos:

```env
APP_HOST=0.0.0.0
APP_PORT=8080

# Reemplazar con tus credenciales reales de MySQL
DATABASE_URL=mysql://usuario:password@localhost:3306/libros

# Origen del frontend (puede ser el puerto 3000/3001/3002 según corresponda)
FRONTEND_ORIGIN=http://localhost:3000
```

> Nota: el formato de `DATABASE_URL` debe ser el que entiende SQLAlchemy. Si tu servidor MySQL está en otra IP dentro de la red de la VM, usa esa IP en lugar de `localhost`.

## 4. Instalación en la VM

En tu VM (por ejemplo en `/home/developer/go_projects/causas-backend` o similar):

```bash
cd /ruta/al/proyecto/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## 5. Ejecutar en desarrollo

Con el entorno virtual activado (`source .venv/bin/activate`):

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

Deberías poder acceder desde tu navegador a:

- `http://IP_DE_LA_VM:8080/docs` → documentación interactiva de la API (Swagger)
- `http://IP_DE_LA_VM:8080/v1/html/health` → endpoint de salud

En tu frontend (`frontend/lib/api.ts`) ajusta la `BASE_URL` para apuntar al nuevo backend FastAPI, por ejemplo:

```ts
export const API_CONFIG = {
  BASE_URL: 'http://10.50.22.2:8080/v1',
  // ...
}
```

## 6. Ejecutar como servicio (systemd)

Para que el backend quede corriendo de forma permanente en la VM, puedes crear un servicio `systemd`.

1. Copia la ruta absoluta de tu proyecto, por ejemplo:

   ```bash
   cd /ruta/al/proyecto/backend
   pwd
   # Ejemplo: /home/developer/proyecto_causas/backend
   ```

2. Crea un archivo de servicio, por ejemplo `/etc/systemd/system/causas-backend.service`:

   ```ini
   [Unit]
   Description=Backend FastAPI - Sistema de Causas
   After=network.target

   [Service]
   User=developer
   WorkingDirectory=/home/developer/proyecto_causas/backend
   ExecStart=/home/developer/proyecto_causas/backend/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8080
   Restart=always
   EnvironmentFile=/home/developer/proyecto_causas/backend/.env

   [Install]
   WantedBy=multi-user.target
   ```

3. Recarga y habilita el servicio:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable causas-backend
   sudo systemctl start causas-backend
   sudo systemctl status causas-backend
   ```

Con esto el backend se levantará automáticamente cuando arranque la VM.

## 7. Conexión desde el frontend

1. Asegúrate de que el puerto `8080` de la VM está accesible desde tu máquina (en Proxmox suele bastar con conectarte a la IP interna de la VM).
2. Ajusta `API_CONFIG.BASE_URL` en el frontend al valor correcto, por ejemplo:

   ```ts
   BASE_URL: 'http://10.50.22.2:8080/v1'
   ```

3. Levanta el frontend (`npm run dev`) y prueba:
   - Login → `POST /v1/login`
   - Listado de causas → `POST /v1/causas`

## 8. Próximos pasos

- Migrar el resto de endpoints (`/altas`, `/bajas`, `/usuarios`, `/updates`, `/causas/historico`) replicando la lógica de tu backend Go en `app/api/v1/`.
- Completar los combos usando tablas reales de tu base de datos.
- Añadir un esquema de tokens más robusto (por ejemplo JWT) si lo necesitas en producción.

Con esta base ya tienes un backend Python organizado, fácil de desplegar en tu VM y compatible con el frontend actual. 

