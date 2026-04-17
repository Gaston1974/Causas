const Client = require('ssh2-sftp-client');
const path = require('path');
const sftp = new Client();

const config = {
  host: '10.50.22.142',
  port: '22',
  username: 'developer',
  password: 'Viernes.1t'
};

async function deploy() {
  try {
    console.log('Conectando a VM 10.50.22.142 para subir el FRONTEND COMPLETO...');
    await sftp.connect(config);
    console.log('¡Conexión SFTP exitosa!');

    const localDir = path.resolve(__dirname);
    const remoteDir = '/home/developer/python_projects/proyecto_causas/frontend';

    console.log(`Subiendo todo desde ${localDir} hacia ${remoteDir}...`);
    console.log('Ignorando node_modules y .next para ahorrar tiempo.');

    await sftp.uploadDir(localDir, remoteDir, {
      filter: (filePath, isDir) => {
        const basename = path.basename(filePath);
        // Ignorar carpetas pesadas
        if (basename === 'node_modules') return false;
        if (basename === '.next') return false;
        if (basename === '.git') return false;
        // Ignorar el archivo de script anterior
        if (basename === 'deploy_causas.js') return false;
        if (basename === 'deploy_full.js') return false;
        
        return true;
      }
    });

    console.log('----------------------------------------------------');
    console.log('🎉 Despliegue MASIVO completado con éxito!');
  } catch (err) {
    console.error('❌ Error durante el despliegue:', err.message);
  } finally {
    await sftp.end();
  }
}

deploy();
