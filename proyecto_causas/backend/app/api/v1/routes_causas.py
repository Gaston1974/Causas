from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db
from app.schemas import Causa, CausasListResponse, CausaBase


router = APIRouter()


@router.post("/causas", response_model=CausasListResponse)
def get_causas(db: Session = Depends(get_db)):
    """
    Implementación básica de /v1/causas:
    - Respeta el método POST y un body JSON vacío, como el backend Go.
    - Devuelve todas las causas de la tabla.
    """
    causas = db.query(models.Causa).all()
    return CausasListResponse(
        causas=[Causa.model_validate(c) for c in causas],
        total=len(causas),
    )

@router.post("/causas/alta", response_model=Causa)
def crear_causa(data: CausaBase, db: Session = Depends(get_db)):
    """Crear una nueva entrada de causa."""
    nueva = models.Causa(

    numero_causa = data.numero_causa ,
    caratula = data.caratula ,
    juzgado = data.juzgado ,
    fiscalia = data.fiscalia ,
    magistrado = data.magistrado ,
    preventor = data.preventor ,
    preventor_auxiliar = data.preventor_auxiliar ,
    provincia_id = data.localidad_id ,
    localidad_id = data.localidad_id ,
   # provincia = Column(String(255))
   # localidad = Column(String(255))
    domicilio = data.domicilio ,
    nro_sgo = data.nro_sgo ,
    nro_mto = data.nro_mto ,
    tipo_delito_id = data.tipo_delito_id ,
    nombre_fantasia = data.nombre_fantasia ,
    providencia = data.providencia ,
    estado = data.estado ,
   # ip_address = Column(String(50))
   # nombre_archivo = Column(String(255))
   # ruta_archivo = Column(String(255))
   # tipo_archivo = Column(String(100))
   # peso_archivo = Column(String(100))
   # subido_por = Column(String(100))
    contenido_nota = data.contenido_nota ,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return Causa.model_validate(nueva)