module.exports = {
  apps: [
    {
      name: "Causas-Backend",
      script: "python", // Asume que Python está en tus variables de entorno o usamos 'uvicorn' directo
      args: "-m uvicorn app.main:app --host 0.0.0.0 --port 8080",
      cwd: "./backend",
      instances: 1,
      autorestart: true, // Magia: Si se cae o crashea, revivirá al instante
      watch: false,      // En producción no queremos recargar por cada archivo
      max_memory_restart: '1G'
    },
    {
      name: "Causas-Frontend",
      script: "pnpm",
      args: "start", // Ejecuta "next start" (el empaquetado de producción)
      cwd: "./frontend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
