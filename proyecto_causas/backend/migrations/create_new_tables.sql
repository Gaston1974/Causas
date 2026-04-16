-- ============================================================
-- MIGRACIÓN v2 — Sistema Causas
-- Crear las nuevas tablas para los módulos adicionales
-- Ejecutar en la VM: mysql -u developer -p sistemadecausas < create_new_tables.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ─────────────────────────────────────────────────────────
-- 1. ORIGEN DE LA CAUSA
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS causa_origenes (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    causa_id                INT NOT NULL,
    origen_tipo             VARCHAR(20) NOT NULL COMMENT 'UNIDAD | JUDICATURA',
    subtipo_unidad          VARCHAR(50) DEFAULT NULL COMMENT 'NOTITIA_CRIMINIS | REGISTRO_INFORMANTE | OTRA',
    descripcion_unidad      TEXT DEFAULT NULL,
    denuncia_anonima        TINYINT(1) DEFAULT 0,
    descripcion_judicatura  TEXT DEFAULT NULL,
    observaciones           TEXT DEFAULT NULL,
    fecha_creacion          DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_causa_origen UNIQUE (causa_id),
    CONSTRAINT fk_co_causa FOREIGN KEY (causa_id) REFERENCES causas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 2. TELÉFONOS INTERVENIDOS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS causa_telefonos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    causa_id            INT NOT NULL,
    numero_linea        VARCHAR(50) NOT NULL,
    titular             VARCHAR(255) DEFAULT NULL,
    modalidad           VARCHAR(20) NOT NULL COMMENT 'DIRECTA | DIFERIDA',
    observaciones       TEXT DEFAULT NULL,
    fecha_inicio        VARCHAR(20) DEFAULT NULL,
    fecha_fin           VARCHAR(20) DEFAULT NULL,
    fecha_creacion      DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ct_causa (causa_id),
    CONSTRAINT fk_ct_causa FOREIGN KEY (causa_id) REFERENCES causas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 3. TÉCNICAS ESPECIALES INVESTIGATIVAS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS causa_tecnicas (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    causa_id            INT NOT NULL,
    tipo                VARCHAR(50) NOT NULL COMMENT 'AGENTE_ENCUBIERTO | AGENTE_REVELADOR | AGENTE_REVELADOR_DIGITAL | COTEJO_VOCES | OTRA',
    descripcion         TEXT DEFAULT NULL,
    fecha_inicio        VARCHAR(20) DEFAULT NULL,
    fecha_fin           VARCHAR(20) DEFAULT NULL,
    resultado           TEXT DEFAULT NULL,
    observaciones       TEXT DEFAULT NULL,
    fecha_creacion      DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ctec_causa (causa_id),
    CONSTRAINT fk_ctec_causa FOREIGN KEY (causa_id) REFERENCES causas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 4. OFICIOS / ELEVACIÓN
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS causa_oficios (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    causa_id            INT NOT NULL,
    tipo                VARCHAR(30) NOT NULL COMMENT 'ELEVACION | INFORME | NOTIFICACION | REQUERIMIENTO | OTRO',
    numero_oficio       VARCHAR(100) DEFAULT NULL,
    fecha_oficio        VARCHAR(20) DEFAULT NULL,
    destinatario        VARCHAR(255) NOT NULL,
    descripcion         TEXT NOT NULL,
    nota_elevacion      TEXT DEFAULT NULL,
    fecha_elevacion     VARCHAR(20) DEFAULT NULL,
    observaciones       TEXT DEFAULT NULL,
    fecha_creacion      DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cof_causa (causa_id),
    CONSTRAINT fk_cof_causa FOREIGN KEY (causa_id) REFERENCES causas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 5. ALLANAMIENTO — CABECERA
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS causa_allanamientos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    causa_id            INT NOT NULL,
    positivo            TINYINT(1) DEFAULT 0,
    fecha_allanamiento  VARCHAR(20) DEFAULT NULL,
    observaciones       TEXT DEFAULT NULL,
    fecha_creacion      DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_causa_allanamiento UNIQUE (causa_id),
    CONSTRAINT fk_ca_causa FOREIGN KEY (causa_id) REFERENCES causas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 6. ALLANAMIENTO — DOMICILIOS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_domicilios (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    calles              VARCHAR(255) NOT NULL,
    provincia           VARCHAR(100) DEFAULT NULL,
    partido             VARCHAR(100) DEFAULT NULL,
    localidad           VARCHAR(100) DEFAULT NULL,
    latitud             VARCHAR(30) DEFAULT NULL,
    longitud            VARCHAR(30) DEFAULT NULL,
    CONSTRAINT fk_ad_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 7. ALLANAMIENTO — ARMAS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_armas (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    tipo_arma           VARCHAR(100) NOT NULL,
    calibre             VARCHAR(50) DEFAULT NULL,
    marca               VARCHAR(100) DEFAULT NULL,
    origen              VARCHAR(50) DEFAULT NULL,
    asociado_delito     VARCHAR(255) DEFAULT NULL,
    deposito_judicial   VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_aa_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 8. ALLANAMIENTO — VEHÍCULOS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_vehiculos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    tipo_vehiculo       VARCHAR(50) NOT NULL,
    marca               VARCHAR(100) DEFAULT NULL,
    modelo              VARCHAR(100) DEFAULT NULL,
    origen              VARCHAR(50) DEFAULT NULL,
    asociado_delito     VARCHAR(255) DEFAULT NULL,
    deposito_judicial   VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_av_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 9. ALLANAMIENTO — CIGARRILLOS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_cigarrillos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    tipo_cigarrillo     VARCHAR(20) NOT NULL COMMENT 'ELECTRONICO | TRADICIONAL',
    marca               VARCHAR(100) DEFAULT NULL,
    unidad              VARCHAR(100) DEFAULT NULL,
    origen              VARCHAR(50) DEFAULT NULL,
    deposito_judicial   VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_acig_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 10. ALLANAMIENTO — ESTUPEFACIENTES
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_estupefacientes (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id         INT NOT NULL,
    tipo_estupefaciente     VARCHAR(50) NOT NULL,
    cantidad_kgs            VARCHAR(100) DEFAULT NULL,
    origen                  VARCHAR(50) DEFAULT NULL,
    deposito_judicial       VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_aest_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 11. ALLANAMIENTO — DIVISAS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_divisas (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    tipo_divisa         VARCHAR(50) NOT NULL,
    cantidad            VARCHAR(100) DEFAULT NULL,
    origen              VARCHAR(50) DEFAULT NULL,
    deposito_judicial   VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_adiv_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 12. ALLANAMIENTO — DETENIDOS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_detenidos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    nombre_apellido     VARCHAR(255) NOT NULL,
    dni                 VARCHAR(30) DEFAULT NULL,
    edad                VARCHAR(10) DEFAULT NULL,
    nacionalidad        VARCHAR(100) DEFAULT NULL,
    estado_detencion    VARCHAR(50) DEFAULT NULL,
    CONSTRAINT fk_adet_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 13. ALLANAMIENTO — RESCATADOS (TRATA)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_rescatados (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    sexo                VARCHAR(20) DEFAULT NULL,
    edad                VARCHAR(20) DEFAULT NULL,
    nacionalidad        VARCHAR(100) DEFAULT NULL,
    CONSTRAINT fk_ares_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 14. ALLANAMIENTO — TECNOLOGÍA
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allanamiento_tecnologia (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    allanamiento_id     INT NOT NULL,
    tipo_objeto         VARCHAR(50) NOT NULL,
    marca               VARCHAR(100) DEFAULT NULL,
    modelo              VARCHAR(100) DEFAULT NULL,
    CONSTRAINT fk_atec_allan FOREIGN KEY (allanamiento_id) REFERENCES causa_allanamientos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────
-- 15. VINCULACIÓN SGO — CAUSA
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS causa_sgos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    causa_id            INT NOT NULL,
    nro_sgo             VARCHAR(100) NOT NULL,
    descripcion         TEXT DEFAULT NULL,
    fecha_vinculacion   VARCHAR(20) DEFAULT NULL,
    observaciones       TEXT DEFAULT NULL,
    fecha_creacion      DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sgo_causa (causa_id),
    CONSTRAINT fk_sgo_causa FOREIGN KEY (causa_id) REFERENCES causas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;

-- ─────────────────────────────────────────────────────────
-- VERIFICACIÓN  (ejecutar opcionalmente)
-- ─────────────────────────────────────────────────────────
-- SHOW TABLES LIKE 'causa_%';
-- SHOW TABLES LIKE 'allanamiento_%';
