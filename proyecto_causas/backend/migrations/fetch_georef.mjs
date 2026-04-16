import fs from 'fs/promises';
import https from 'https';

// Promisify https.get
const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
};

async function main() {
  console.log("📥 Consultando API de Provincias (Georef Ar)...");
  const provsData = await fetchJson('https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=100');
  let provincias = provsData.provincias;

  console.log("📥 Consultando API de Localidades (Georef Ar)... puede tardar unos segundos");
  // max=5000 es suficiente ya que las localidades oficiales en Georef Ar son alrededor de ~4140
  const locsData = await fetchJson('https://apis.datos.gob.ar/georef/api/localidades?campos=id,nombre,provincia.id&max=5000');
  let localidades = locsData.localidades;

  console.log(`✅ ¡Descarga completada! (${provincias.length} provincias, ${localidades.length} localidades encontradas)`);

  // SORT data for consistency
  provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
  localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));

  // 1. GENERATE JSON
  const dbJson = {
    provincias,
    localidades
  };
  await fs.writeFile('georef_argentina.json', JSON.stringify(dbJson, null, 2), 'utf-8');
  console.log("📄 Archivo JSON generado: georef_argentina.json");

  // 2. GENERATE SQL DUMP
  let sql = `-- Script de volcado: Provincias y Localidades de la República Argentina (Georef)
-- Generado Automáticamente para el Sistema Causas

SET NAMES utf8mb4;

-- Estructura y datos de PROVINCIAS
CREATE TABLE IF NOT EXISTS provincias (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

TRUNCATE TABLE provincias;

INSERT INTO provincias (id, nombre) VALUES
`;
  
  const provValues = provincias.map(p => `(${p.id}, '${p.nombre.replace(/'/g, "''")}')`);
  sql += provValues.join(",\n") + ";\n\n";

  sql += `-- Estructura y datos de LOCALIDADES
CREATE TABLE IF NOT EXISTS localidades (
    id VARCHAR(20) PRIMARY KEY, -- Usamos Varchar porque los ids de Georef para localidades pueden tener ceros a la izquierda o ser muy largos numéricamente
    provincia_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    FOREIGN KEY (provincia_id) REFERENCES provincias(id) ON DELETE CASCADE
);

TRUNCATE TABLE localidades;

INSERT INTO localidades (id, provincia_id, nombre) VALUES
`;

  // Limitar insert batches para que no falle MySQL si es muy grande
  const chunkSize = 500;
  for (let i = 0; i < localidades.length; i += chunkSize) {
    const chunk = localidades.slice(i, i + chunkSize);
    const locValues = chunk.map(l => `('${l.id}', ${l.provincia.id}, '${l.nombre.replace(/'/g, "''")}')`);
    sql += locValues.join(",\n") + ";\n" + (i + chunkSize < localidades.length ? "INSERT INTO localidades (id, provincia_id, nombre) VALUES\n" : "\n");
  }

  await fs.writeFile('georef_argentina.sql', sql, 'utf-8');
  console.log("💾 Archivo SQL generado: georef_argentina.sql");

  console.log("🚀 ¡Operación Exitosa!");
}

main().catch(console.error);
