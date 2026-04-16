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
