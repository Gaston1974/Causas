const Client = require('ssh2-sftp-client');
const path = require('path');
const sftp = new Client();

const config = {
  host: '10.50.22.142',
  port: '22',
  username: 'developer',
  password: 'Viernes.1t'
};

const DIRS_TO_UPLOAD = [
  { local: './app/causas', remote: '/home/developer/python_projects/proyecto_causas/frontend/app/causas' },
  { local: './components/causa-tabs', remote: '/home/developer/python_projects/proyecto_causas/frontend/components/causa-tabs' },
  { local: './hooks/use-causa.ts', remote: '/home/developer/python_projects/proyecto_causas/frontend/hooks/use-causa.ts' }
];

async function deploy() {
  try {
    console.log('Conectando a VM 10.50.22.142...');
    await sftp.connect(config);
    console.log('¡Conexión SFTP exitosa!');

    for (const dir of DIRS_TO_UPLOAD) {
      if (dir.local.endsWith('.ts') || dir.local.endsWith('.tsx')) {
         console.log(`Subiendo archivo: ${dir.local}...`);
         await sftp.fastPut(dir.local, dir.remote);
      } else {
         console.log(`Subiendo directorio: ${dir.local}...`);
         await sftp.uploadDir(dir.local, dir.remote);
      }
      console.log(`✅ ${dir.local} subido correctamente.`);
    }

    console.log('----------------------------------------------------');
    console.log('🎉 Despliegue completado con éxito!');
  } catch (err) {
    console.error('❌ Error durante el despliegue:', err.message);
  } finally {
    await sftp.end();
  }
}

deploy();
