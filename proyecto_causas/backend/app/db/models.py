from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base


# =============================================================================
# USUARIOS
# =============================================================================

class Usuario(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    email = Column(String(254), unique=True, index=True)
    dni = Column(String(20), unique=True, index=True)
    username = Column(String(150), unique=False, index=True)
    ce = Column(String(20), nullable=True)
    grado = Column(String(50), nullable=True)
    password_hash = Column(String(256), nullable=False)
    rol = Column(String(50), nullable=False, default="normal")
    nombre_completo = Column(String(150), nullable=True)


# =============================================================================
# CAUSA (tabla principal)
# =============================================================================

class Causa(Base):
    __tablename__ = "causas"

    id = Column(Integer, primary_key=True, index=True)
    numero_causa = Column(String(100), index=True)
    caratula = Column(String(255))
    juzgado = Column(String(255))
    fiscalia = Column(String(255))
    magistrado = Column(String(255))
    preventor = Column(String(255))
    preventor_auxiliar = Column(String(255))
    provincia_id = Column(String(50))
    localidad_id = Column(String(50))
    domicilio = Column(String(255))
    nro_sgo = Column(String(100))
    nro_mto = Column(String(100))
    tipo_delito_id = Column(String(255))
    nombre_fantasia = Column(String(255))
    providencia = Column(Text)
    estado = Column(String(50))
    contenido_nota = Column(Text)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relaciones
    origen = relationship("CausaOrigen", back_populates="causa", uselist=False, cascade="all, delete-orphan")
    telefonos = relationship("CausaTelefono", back_populates="causa", cascade="all, delete-orphan")
    tecnicas = relationship("CausaTecnica", back_populates="causa", cascade="all, delete-orphan")
    oficios = relationship("CausaOficio", back_populates="causa", cascade="all, delete-orphan")
    allanamiento = relationship("CausaAllanamiento", back_populates="causa", uselist=False, cascade="all, delete-orphan")
    sgos = relationship("CausaSGO", back_populates="causa", cascade="all, delete-orphan")


# =============================================================================
# ORIGEN DE LA CAUSA
# =============================================================================

class CausaOrigen(Base):
    __tablename__ = "causa_origenes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    causa_id = Column(Integer, ForeignKey("causas.id", ondelete="CASCADE"), nullable=False, unique=True)
    origen_tipo = Column(String(20), nullable=False)          # UNIDAD | JUDICATURA
    subtipo_unidad = Column(String(50), nullable=True)         # NOTITIA_CRIMINIS | REGISTRO_INFORMANTE | OTRA
    descripcion_unidad = Column(Text, nullable=True)
    denuncia_anonima = Column(Boolean, default=False)
    descripcion_judicatura = Column(Text, nullable=True)
    observaciones = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    causa = relationship("Causa", back_populates="origen")


# =============================================================================
# TELÉFONOS INTERVENIDOS
# =============================================================================

class CausaTelefono(Base):
    __tablename__ = "causa_telefonos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    causa_id = Column(Integer, ForeignKey("causas.id", ondelete="CASCADE"), nullable=False, index=True)
    numero_linea = Column(String(50), nullable=False)
    titular = Column(String(255), nullable=True)
    modalidad = Column(String(20), nullable=False)             # DIRECTA | DIFERIDA
    observaciones = Column(Text, nullable=True)
    fecha_inicio = Column(String(20), nullable=True)
    fecha_fin = Column(String(20), nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    causa = relationship("Causa", back_populates="telefonos")


# =============================================================================
# TÉCNICAS ESPECIALES INVESTIGATIVAS
# =============================================================================

class CausaTecnica(Base):
    __tablename__ = "causa_tecnicas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    causa_id = Column(Integer, ForeignKey("causas.id", ondelete="CASCADE"), nullable=False, index=True)
    tipo = Column(String(50), nullable=False)                  # AGENTE_ENCUBIERTO | AGENTE_REVELADOR | ...
    descripcion = Column(Text, nullable=True)
    fecha_inicio = Column(String(20), nullable=True)
    fecha_fin = Column(String(20), nullable=True)
    resultado = Column(Text, nullable=True)
    observaciones = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    causa = relationship("Causa", back_populates="tecnicas")


# =============================================================================
# OFICIOS / ELEVACIÓN
# =============================================================================

class CausaOficio(Base):
    __tablename__ = "causa_oficios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    causa_id = Column(Integer, ForeignKey("causas.id", ondelete="CASCADE"), nullable=False, index=True)
    tipo = Column(String(30), nullable=False)                  # ELEVACION | INFORME | NOTIFICACION | REQUERIMIENTO | OTRO
    numero_oficio = Column(String(100), nullable=True)
    fecha_oficio = Column(String(20), nullable=True)
    destinatario = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=False)
    # Campos exclusivos de ELEVACION
    nota_elevacion = Column(Text, nullable=True)
    fecha_elevacion = Column(String(20), nullable=True)
    observaciones = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    causa = relationship("Causa", back_populates="oficios")


# =============================================================================
# ALLANAMIENTO — CABECERA
# =============================================================================

class CausaAllanamiento(Base):
    __tablename__ = "causa_allanamientos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    causa_id = Column(Integer, ForeignKey("causas.id", ondelete="CASCADE"), nullable=False, unique=True)
    positivo = Column(Boolean, default=False)
    fecha_allanamiento = Column(String(20), nullable=True)
    observaciones = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    causa = relationship("Causa", back_populates="allanamiento")
    domicilios = relationship("AllanamientoDomicilio", back_populates="allanamiento", cascade="all, delete-orphan")
    armas = relationship("AllanamientoArma", back_populates="allanamiento", cascade="all, delete-orphan")
    vehiculos = relationship("AllanamientoVehiculo", back_populates="allanamiento", cascade="all, delete-orphan")
    cigarrillos = relationship("AllanamientoCigarrillo", back_populates="allanamiento", cascade="all, delete-orphan")
    estupefacientes = relationship("AllanamientoEstupefaciente", back_populates="allanamiento", cascade="all, delete-orphan")
    divisas = relationship("AllanamientoDivisa", back_populates="allanamiento", cascade="all, delete-orphan")
    detenidos = relationship("AllanamientoDetenido", back_populates="allanamiento", cascade="all, delete-orphan")
    rescatados = relationship("AllanamientoRescatado", back_populates="allanamiento", cascade="all, delete-orphan")
    tecnologia = relationship("AllanamientoTecnologia", back_populates="allanamiento", cascade="all, delete-orphan")


# =============================================================================
# ALLANAMIENTO — SUB-MÓDULOS
# =============================================================================

class AllanamientoDomicilio(Base):
    __tablename__ = "allanamiento_domicilios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    calles = Column(String(255), nullable=False)
    provincia = Column(String(100), nullable=True)
    partido = Column(String(100), nullable=True)
    localidad = Column(String(100), nullable=True)
    latitud = Column(String(30), nullable=True)
    longitud = Column(String(30), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="domicilios")


class AllanamientoArma(Base):
    __tablename__ = "allanamiento_armas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    tipo_arma = Column(String(100), nullable=False)
    calibre = Column(String(50), nullable=True)
    marca = Column(String(100), nullable=True)
    origen = Column(String(50), nullable=True)
    asociado_delito = Column(String(255), nullable=True)
    deposito_judicial = Column(String(255), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="armas")


class AllanamientoVehiculo(Base):
    __tablename__ = "allanamiento_vehiculos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    tipo_vehiculo = Column(String(50), nullable=False)
    marca = Column(String(100), nullable=True)
    modelo = Column(String(100), nullable=True)
    origen = Column(String(50), nullable=True)
    asociado_delito = Column(String(255), nullable=True)
    deposito_judicial = Column(String(255), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="vehiculos")


class AllanamientoCigarrillo(Base):
    __tablename__ = "allanamiento_cigarrillos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    tipo_cigarrillo = Column(String(20), nullable=False)       # ELECTRONICO | TRADICIONAL
    marca = Column(String(100), nullable=True)
    unidad = Column(String(100), nullable=True)
    origen = Column(String(50), nullable=True)
    deposito_judicial = Column(String(255), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="cigarrillos")


class AllanamientoEstupefaciente(Base):
    __tablename__ = "allanamiento_estupefacientes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    tipo_estupefaciente = Column(String(50), nullable=False)
    cantidad_kgs = Column(String(100), nullable=True)
    origen = Column(String(50), nullable=True)
    deposito_judicial = Column(String(255), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="estupefacientes")


class AllanamientoDivisa(Base):
    __tablename__ = "allanamiento_divisas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    tipo_divisa = Column(String(50), nullable=False)
    cantidad = Column(String(100), nullable=True)
    origen = Column(String(50), nullable=True)
    deposito_judicial = Column(String(255), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="divisas")


class AllanamientoDetenido(Base):
    __tablename__ = "allanamiento_detenidos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    nombre_apellido = Column(String(255), nullable=False)
    dni = Column(String(30), nullable=True)
    edad = Column(String(10), nullable=True)
    nacionalidad = Column(String(100), nullable=True)
    estado_detencion = Column(String(50), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="detenidos")


class AllanamientoRescatado(Base):
    __tablename__ = "allanamiento_rescatados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    sexo = Column(String(20), nullable=True)
    edad = Column(String(20), nullable=True)
    nacionalidad = Column(String(100), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="rescatados")


class AllanamientoTecnologia(Base):
    __tablename__ = "allanamiento_tecnologia"

    id = Column(Integer, primary_key=True, autoincrement=True)
    allanamiento_id = Column(Integer, ForeignKey("causa_allanamientos.id", ondelete="CASCADE"), nullable=False)
    tipo_objeto = Column(String(50), nullable=False)
    marca = Column(String(100), nullable=True)
    modelo = Column(String(100), nullable=True)

    allanamiento = relationship("CausaAllanamiento", back_populates="tecnologia")


# =============================================================================
# VINCULACIÓN SGO — CAUSA
# =============================================================================

class CausaSGO(Base):
    __tablename__ = "causa_sgos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    causa_id = Column(Integer, ForeignKey("causas.id", ondelete="CASCADE"), nullable=False, index=True)
    nro_sgo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_vinculacion = Column(String(20), nullable=True)
    observaciones = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())

    causa = relationship("Causa", back_populates="sgos")


# =============================================================================
# MESA DE ENTRADAS
# =============================================================================

class MesaEntrada(Base):
    __tablename__ = "mesa_entradas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha = Column(DateTime, nullable=False)
    procedencia = Column(String(50), nullable=False)
    remitente = Column(String(255), nullable=False)
    juzgado = Column(String(255), nullable=True)
    fiscalia = Column(String(255), nullable=True)
    descripcion = Column(Text, nullable=False)
    nro_causa = Column(String(100), nullable=False)
    nro_expte = Column(String(100), nullable=True)
    obs = Column(String(50), nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
