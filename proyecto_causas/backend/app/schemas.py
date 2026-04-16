from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr
#from pydantic_settings import BaseSettings   # ✅ new (v2)



# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------



class LoginRequest(BaseModel):
    email: Optional[str] = None
    password: str
    twoFactor: Optional[str] = None
    ce: Optional[str] = None
    username: Optional[str] = None
    dni: Optional[str] = None


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    dni: str
    username: str
    clave: str
    rol: str = "normal"
    ce: Optional[str] = None
    grado: Optional[str] = None
    nombre_completo: Optional[str] = None


class User(BaseModel):
    id: int
    email: Optional[EmailStr] = None
    nombre_completo: Optional[str] = None
    rol: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    token: str
    requires2FA: bool = False
    user: Optional[User] = None
    message: Optional[str] = None


# ---------------------------------------------------------------------------
# Provincia
# ---------------------------------------------------------------------------

class ProvinciaBase(BaseModel):
    codigo: str           # e.g. "BA", "CABA", "CO"
    nombre: str           # e.g. "Buenos Aires"


class ProvinciaCreate(ProvinciaBase):
    pass


class Provincia(ProvinciaBase):
    id: int

    class Config:
        from_attributes = True


class ProvinciasListResponse(BaseModel):
    provincias: List[Provincia]
    total: int


# ---------------------------------------------------------------------------
# Localidad
# ---------------------------------------------------------------------------

class LocalidadBase(BaseModel):
    nombre: str
    provincia_id: int


class LocalidadCreate(LocalidadBase):
    pass


class Localidad(LocalidadBase):
    id: int
    provincia: Optional[str] = None   # nombre de la provincia (join)

    class Config:
        from_attributes = True


class LocalidadesListResponse(BaseModel):
    localidades: List[Localidad]
    total: int


# ---------------------------------------------------------------------------
# Categoría de delito
# ---------------------------------------------------------------------------

class CategoriaDelitoBase(BaseModel):
    nombre: str           # e.g. "Delitos informáticos"
    descripcion: Optional[str] = None


class CategoriaDelitoCreate(CategoriaDelitoBase):
    pass


class CategoriaDelito(CategoriaDelitoBase):
    id: int

    class Config:
        from_attributes = True


class CategoriasDelitoListResponse(BaseModel):
    categorias: List[CategoriaDelito]
    total: int


# ---------------------------------------------------------------------------
# Tipo de delito
# ---------------------------------------------------------------------------

class TipoDelitoBase(BaseModel):
    nombre: str                        # e.g. "Acceso ilegítimo a sistemas informáticos (Art. 153 bis)"
    categoria_id: int
    articulo: Optional[str] = None     # e.g. "Art. 153 bis"
    ley: Optional[str] = None          # e.g. "Ley 25.326"


class TipoDelitoCreate(TipoDelitoBase):
    pass


class TipoDelito(TipoDelitoBase):
    id: int
    categoria: Optional[str] = None    # nombre de la categoría (join)

    class Config:
        from_attributes = True


class TiposDelitoListResponse(BaseModel):
    tipos: List[TipoDelito]
    total: int


# ---------------------------------------------------------------------------
# Estado de causa
# ---------------------------------------------------------------------------

ESTADOS_CAUSA = [
    "Activa",
    "Archivada",
    "Cerrada",
    "Suspendida",
    "En investigación",
]


# ---------------------------------------------------------------------------
# Causa
# ---------------------------------------------------------------------------

class CausaBase(BaseModel):
    numero_causa: str
    caratula: str
    juzgado: str
    fiscalia: str
    magistrado: str
    preventor: str
    preventor_auxiliar: str
    provincia_id: int
    localidad_id: int
    domicilio: str
    nro_sgo: str
    nro_mto: str
    tipo_delito_id: int
    nombre_fantasia: str
    providencia: str
    estado: str                        # debe estar en ESTADOS_CAUSA
    ip_address: Optional[str] = None
    contenido_nota: Optional[str] = None


class CausaCreate(CausaBase):
    pass


class CausaUpdate(BaseModel):
    """Todos los campos opcionales para PATCH."""
    caratula: Optional[str] = None
    juzgado: Optional[str] = None
    fiscalia: Optional[str] = None
    magistrado: Optional[str] = None
    preventor: Optional[str] = None
    preventor_auxiliar: Optional[str] = None
    provincia_id: Optional[int] = None
    localidad_id: Optional[int] = None
    domicilio: Optional[str] = None
    nro_sgo: Optional[str] = None
    nro_mto: Optional[str] = None
    tipo_delito_id: Optional[int] = None
    nombre_fantasia: Optional[str] = None
    providencia: Optional[str] = None
    estado: Optional[str] = None
    ip_address: Optional[str] = None
    contenido_nota: Optional[str] = None


class Causa(CausaBase):
    id: int
    # Campos resueltos (joins) — se pueblan en la capa de servicio
    provincia: Optional[str] = None
    localidad: Optional[str] = None
    tipo_delito: Optional[str] = None
    categoria_delito: Optional[str] = None
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True


class CausasListResponse(BaseModel):
    causas: List[Causa]
    total: int


# ---------------------------------------------------------------------------
# Mesa de Entrada
# ---------------------------------------------------------------------------

class MesaEntradaCreate(BaseModel):
    fecha: datetime
    procedencia: str
    remitente: str
    juzgado: Optional[str] = None
    fiscalia: Optional[str] = None
    descripcion: str
    nro_causa: str
    nro_expte: Optional[str] = None
    obs: Optional[str] = None


class MesaEntrada(BaseModel):
    id: int
    fecha: datetime
    procedencia: str
    remitente: str
    juzgado: Optional[str] = None
    fiscalia: Optional[str] = None
    descripcion: str
    nro_causa: str
    nro_expte: Optional[str] = None
    obs: Optional[str] = None
    fecha_creacion: datetime

    class Config:
        from_attributes = True


class MesaEntradasListResponse(BaseModel):
    entradas: List[MesaEntrada]
    total: int


# ---------------------------------------------------------------------------
# Origen de la Causa
# ---------------------------------------------------------------------------

class CausaOrigenBase(BaseModel):
    causa_id: int
    origen_tipo: str                         # UNIDAD | JUDICATURA
    subtipo_unidad: Optional[str] = None     # NOTITIA_CRIMINIS | REGISTRO_INFORMANTE | OTRA
    descripcion_unidad: Optional[str] = None
    denuncia_anonima: Optional[bool] = False
    descripcion_judicatura: Optional[str] = None
    observaciones: Optional[str] = None

class CausaOrigenCreate(CausaOrigenBase):
    pass

class CausaOrigenResponse(CausaOrigenBase):
    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Teléfonos Intervenidos
# ---------------------------------------------------------------------------

class CausaTelefonoBase(BaseModel):
    causa_id: int
    numero_linea: str
    titular: Optional[str] = None
    modalidad: str                           # DIRECTA | DIFERIDA
    observaciones: Optional[str] = None
    fecha_inicio: Optional[str] = None
    fecha_fin: Optional[str] = None

class CausaTelefonoCreate(CausaTelefonoBase):
    pass

class CausaTelefonoResponse(CausaTelefonoBase):
    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

class CausaTelefonosList(BaseModel):
    telefonos: List[CausaTelefonoResponse]
    total: int


# ---------------------------------------------------------------------------
# Técnicas Especiales Investigativas
# ---------------------------------------------------------------------------

class CausaTecnicaBase(BaseModel):
    causa_id: int
    tipo: str                                # AGENTE_ENCUBIERTO | AGENTE_REVELADOR | ...
    descripcion: Optional[str] = None
    fecha_inicio: Optional[str] = None
    fecha_fin: Optional[str] = None
    resultado: Optional[str] = None
    observaciones: Optional[str] = None

class CausaTecnicaCreate(CausaTecnicaBase):
    pass

class CausaTecnicaResponse(CausaTecnicaBase):
    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

class CausaTecnicasList(BaseModel):
    tecnicas: List[CausaTecnicaResponse]
    total: int


# ---------------------------------------------------------------------------
# Oficios / Elevación
# ---------------------------------------------------------------------------

class CausaOficioBase(BaseModel):
    causa_id: int
    tipo: str                                # ELEVACION | INFORME | NOTIFICACION | REQUERIMIENTO | OTRO
    numero_oficio: Optional[str] = None
    fecha_oficio: Optional[str] = None
    destinatario: str
    descripcion: str
    nota_elevacion: Optional[str] = None
    fecha_elevacion: Optional[str] = None
    observaciones: Optional[str] = None

class CausaOficioCreate(CausaOficioBase):
    pass

class CausaOficioResponse(CausaOficioBase):
    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

class CausaOficiosList(BaseModel):
    oficios: List[CausaOficioResponse]
    total: int


# ---------------------------------------------------------------------------
# Allanamiento — Sub-modelos base
# ---------------------------------------------------------------------------

class AllanamientoDomicilioBase(BaseModel):
    calles: str
    provincia: Optional[str] = None
    partido: Optional[str] = None
    localidad: Optional[str] = None
    latitud: Optional[str] = None
    longitud: Optional[str] = None

class AllanamientoDomicilioResponse(AllanamientoDomicilioBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoArmaBase(BaseModel):
    tipo_arma: str
    calibre: Optional[str] = None
    marca: Optional[str] = None
    origen: Optional[str] = None
    asociado_delito: Optional[str] = None
    deposito_judicial: Optional[str] = None

class AllanamientoArmaResponse(AllanamientoArmaBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoVehiculoBase(BaseModel):
    tipo_vehiculo: str
    marca: Optional[str] = None
    modelo: Optional[str] = None
    origen: Optional[str] = None
    asociado_delito: Optional[str] = None
    deposito_judicial: Optional[str] = None

class AllanamientoVehiculoResponse(AllanamientoVehiculoBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoCigarrilloBase(BaseModel):
    tipo_cigarrillo: str
    marca: Optional[str] = None
    unidad: Optional[str] = None
    origen: Optional[str] = None
    deposito_judicial: Optional[str] = None

class AllanamientoCigarrilloResponse(AllanamientoCigarrilloBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoEstupefacienteBase(BaseModel):
    tipo_estupefaciente: str
    cantidad_kgs: Optional[str] = None
    origen: Optional[str] = None
    deposito_judicial: Optional[str] = None

class AllanamientoEstupefacienteResponse(AllanamientoEstupefacienteBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoDivisaBase(BaseModel):
    tipo_divisa: str
    cantidad: Optional[str] = None
    origen: Optional[str] = None
    deposito_judicial: Optional[str] = None

class AllanamientoDivisaResponse(AllanamientoDivisaBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoDetenidoBase(BaseModel):
    nombre_apellido: str
    dni: Optional[str] = None
    edad: Optional[str] = None
    nacionalidad: Optional[str] = None
    estado_detencion: Optional[str] = None

class AllanamientoDetenidoResponse(AllanamientoDetenidoBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoRescatadoBase(BaseModel):
    sexo: Optional[str] = None
    edad: Optional[str] = None
    nacionalidad: Optional[str] = None

class AllanamientoRescatadoResponse(AllanamientoRescatadoBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


class AllanamientoTecnologiaBase(BaseModel):
    tipo_objeto: str
    marca: Optional[str] = None
    modelo: Optional[str] = None

class AllanamientoTecnologiaResponse(AllanamientoTecnologiaBase):
    id: int
    allanamiento_id: int
    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Allanamiento — Cabecera (con sub-listas anidadas)
# ---------------------------------------------------------------------------

class CausaAllanamientoCreate(BaseModel):
    causa_id: int
    positivo: bool = False
    fecha_allanamiento: Optional[str] = None
    observaciones: Optional[str] = None
    # Listas de ítems (se upsert-ean en la misma petición)
    domicilios: List[AllanamientoDomicilioBase] = []
    armas: List[AllanamientoArmaBase] = []
    vehiculos: List[AllanamientoVehiculoBase] = []
    cigarrillos: List[AllanamientoCigarrilloBase] = []
    estupefacientes: List[AllanamientoEstupefacienteBase] = []
    divisas: List[AllanamientoDivisaBase] = []
    detenidos: List[AllanamientoDetenidoBase] = []
    rescatados: List[AllanamientoRescatadoBase] = []
    tecnologia: List[AllanamientoTecnologiaBase] = []


class CausaAllanamientoResponse(BaseModel):
    id: int
    causa_id: int
    positivo: bool
    fecha_allanamiento: Optional[str] = None
    observaciones: Optional[str] = None
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    domicilios: List[AllanamientoDomicilioResponse] = []
    armas: List[AllanamientoArmaResponse] = []
    vehiculos: List[AllanamientoVehiculoResponse] = []
    cigarrillos: List[AllanamientoCigarrilloResponse] = []
    estupefacientes: List[AllanamientoEstupefacienteResponse] = []
    divisas: List[AllanamientoDivisaResponse] = []
    detenidos: List[AllanamientoDetenidoResponse] = []
    rescatados: List[AllanamientoRescatadoResponse] = []
    tecnologia: List[AllanamientoTecnologiaResponse] = []

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Vinculación SGO — Causa
# ---------------------------------------------------------------------------

class CausaSGOBase(BaseModel):
    causa_id: int
    nro_sgo: str
    descripcion: Optional[str] = None
    fecha_vinculacion: Optional[str] = None
    observaciones: Optional[str] = None

class CausaSGOCreate(CausaSGOBase):
    pass

class CausaSGOResponse(CausaSGOBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

class CausaSGOsList(BaseModel):
    sgos: List[CausaSGOResponse]
    total: int
