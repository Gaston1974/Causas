from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func

from app.db.session import Base


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
   # provincia = Column(String(255))
   # localidad = Column(String(255))
    domicilio = Column(String(255))
    nro_sgo = Column(String(100))
    nro_mto = Column(String(100))
    tipo_delito_id = Column(String(255))
    nombre_fantasia = Column(String(255))
    providencia = Column(Text)
    estado = Column(String(50))
   # ip_address = Column(String(50))
   # nombre_archivo = Column(String(255))
   # ruta_archivo = Column(String(255))
   # tipo_archivo = Column(String(100))
   # peso_archivo = Column(String(100))
   # subido_por = Column(String(100))
    contenido_nota = Column(Text)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())


class MesaEntrada(Base):
    __tablename__ = "mesa_entradas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha = Column(DateTime, nullable=False)
    procedencia = Column(String(50), nullable=False)  # email, mto, otro
    remitente = Column(String(255), nullable=False)
    juzgado = Column(String(255), nullable=True)
    fiscalia = Column(String(255), nullable=True)
    descripcion = Column(Text, nullable=False)
    nro_causa = Column(String(100), nullable=False)
    nro_expte = Column(String(100), nullable=True)
    obs = Column(String(50), nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())

