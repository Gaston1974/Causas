const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
  host: '10.50.22.142',
  port: '22',
  username: 'developer',
  password: 'Viernes.1t'
};

async function check() {
  try {
    await sftp.connect(config);
    const list = await sftp.list('/home/developer/python_projects/proyecto_causas/frontend/app/causas');
    console.log("Archivos en app/causas:", list.map(i => i.name));
    
    try {
        const list2 = await sftp.list('/home/developer/python_projects/proyecto_causas/frontend/components/causa-tabs');
        console.log("Archivos en causa-tabs:", list2.map(i => i.name));
    } catch(e) {
        console.log("Directorio causa-tabs no existe en remoto!");
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await sftp.end();
  }
}
check();
