const Client = require('ssh2-sftp-client');
const sftp = new Client();
const fs = require('fs');
const path = require('path');

const config = {
  host: '10.50.22.142',
  port: '22',
  username: 'developer',
  password: 'Viernes.1t'
};

async function uploadLoginAndRebuild() {
  try {
    await sftp.connect(config);
    const localFile = path.resolve(__dirname, 'app/simple-login.tsx');
    const remoteFile = '/home/developer/python_projects/proyecto_causas/frontend/app/simple-login.tsx';
    console.log('Subiendo simple-login.tsx corregido...');
    await sftp.put(localFile, remoteFile);
    console.log('Exito subiendo.');
  } catch(e) {
    console.error(e);
  } finally {
    await sftp.end();
  }
}
uploadLoginAndRebuild();
