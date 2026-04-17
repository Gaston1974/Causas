const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
  host: '10.50.22.142',
  port: '22',
  username: 'developer',
  password: 'Viernes.1t'
};

async function readRemote() {
  try {
    await sftp.connect(config);
    const content = await sftp.get('/home/developer/python_projects/proyecto_causas/frontend/app/causas/[id]/page.tsx');
    console.log(content.toString('utf8').substring(0, 500));
  } catch (err) {
    console.error(err.message);
  } finally {
    await sftp.end();
  }
}
readRemote();
