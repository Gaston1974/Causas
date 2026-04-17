const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('Cliente listo. Ejecutando reconstrucción...');
  
  const cmd = `
    source ~/.bashrc || true
    export PATH="$HOME/.local/share/pnpm:$PATH"
    cd /home/developer/python_projects/proyecto_causas/frontend &&
    pkill node || true;
    echo "Borrando caché .next..." &&
    rm -rf .next &&
    echo "Compilando con pnpm build..." &&
    pnpm build &&
    echo "Iniciando servidor de fondo..." &&
    nohup pnpm start > /dev/null 2>&1 &
    echo "Hecho!"
  `;

  conn.exec(cmd, { pty: false }, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Proceso cerrado con código: ' + code);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).connect({
  host: '10.50.22.142',
  port: 22,
  username: 'developer',
  password: 'Viernes.1t'
});
