"""
routes_extras.py
CRUD para: Origen, Teléfonos, Técnicas Especiales e Oficios/Elevación
Todos los endpoints siguen el patrón /v1/causas/{causa_id}/<recurso>
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import models
from app.db.session import get_db
from app.schemas import (
    CausaOrigenCreate, CausaOrigenResponse,
    CausaTelefonoCreate, CausaTelefonoResponse, CausaTelefonosList,
    CausaTecnicaCreate, CausaTecnicaResponse, CausaTecnicasList,
    CausaOficioCreate, CausaOficioResponse, CausaOficiosList,
)

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# ORIGEN DE LA CAUSA  (1 registro por causa, upsert)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/causas/{causa_id}/origen", response_model=CausaOrigenResponse)
def get_origen(causa_id: int, db: Session = Depends(get_db)):
    obj = db.query(models.CausaOrigen).filter(models.CausaOrigen.causa_id == causa_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Origen no encontrado")
    return obj


@router.put("/causas/{causa_id}/origen", response_model=CausaOrigenResponse)
def upsert_origen(causa_id: int, data: CausaOrigenCreate, db: Session = Depends(get_db)):
    """Crea o actualiza el origen de una causa (upsert)."""
    obj = db.query(models.CausaOrigen).filter(models.CausaOrigen.causa_id == causa_id).first()
    if obj:
        for k, v in data.model_dump(exclude={"causa_id"}).items():
            setattr(obj, k, v)
    else:
        obj = models.CausaOrigen(**data.model_dump())
        db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ─────────────────────────────────────────────────────────────────────────────
# TELÉFONOS INTERVENIDOS
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/causas/{causa_id}/telefonos", response_model=CausaTelefonosList)
def get_telefonos(causa_id: int, db: Session = Depends(get_db)):
    items = db.query(models.CausaTelefono).filter(models.CausaTelefono.causa_id == causa_id).all()
    return CausaTelefonosList(telefonos=[CausaTelefonoResponse.model_validate(i) for i in items], total=len(items))


@router.post("/causas/{causa_id}/telefonos", response_model=CausaTelefonoResponse)
def create_telefono(causa_id: int, data: CausaTelefonoCreate, db: Session = Depends(get_db)):
    obj = models.CausaTelefono(**{**data.model_dump(), "causa_id": causa_id})
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/causas/{causa_id}/telefonos/{tel_id}", response_model=CausaTelefonoResponse)
def update_telefono(causa_id: int, tel_id: int, data: CausaTelefonoCreate, db: Session = Depends(get_db)):
    obj = db.query(models.CausaTelefono).filter(
        models.CausaTelefono.id == tel_id,
        models.CausaTelefono.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Teléfono no encontrado")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/causas/{causa_id}/telefonos/{tel_id}", status_code=204)
def delete_telefono(causa_id: int, tel_id: int, db: Session = Depends(get_db)):
    obj = db.query(models.CausaTelefono).filter(
        models.CausaTelefono.id == tel_id,
        models.CausaTelefono.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Teléfono no encontrado")
    db.delete(obj)
    db.commit()


# Endpoint de guardado masivo (reemplaza toda la lista)
@router.put("/causas/{causa_id}/telefonos/bulk", response_model=CausaTelefonosList)
def bulk_update_telefonos(causa_id: int, data: List[CausaTelefonoCreate], db: Session = Depends(get_db)):
    db.query(models.CausaTelefono).filter(models.CausaTelefono.causa_id == causa_id).delete()
    nuevos = [models.CausaTelefono(**{**d.model_dump(), "causa_id": causa_id}) for d in data]
    db.add_all(nuevos)
    db.commit()
    items = db.query(models.CausaTelefono).filter(models.CausaTelefono.causa_id == causa_id).all()
    return CausaTelefonosList(telefonos=[CausaTelefonoResponse.model_validate(i) for i in items], total=len(items))


# ─────────────────────────────────────────────────────────────────────────────
# TÉCNICAS ESPECIALES INVESTIGATIVAS
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/causas/{causa_id}/tecnicas", response_model=CausaTecnicasList)
def get_tecnicas(causa_id: int, db: Session = Depends(get_db)):
    items = db.query(models.CausaTecnica).filter(models.CausaTecnica.causa_id == causa_id).all()
    return CausaTecnicasList(tecnicas=[CausaTecnicaResponse.model_validate(i) for i in items], total=len(items))


@router.post("/causas/{causa_id}/tecnicas", response_model=CausaTecnicaResponse)
def create_tecnica(causa_id: int, data: CausaTecnicaCreate, db: Session = Depends(get_db)):
    obj = models.CausaTecnica(**{**data.model_dump(), "causa_id": causa_id})
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/causas/{causa_id}/tecnicas/{tec_id}", response_model=CausaTecnicaResponse)
def update_tecnica(causa_id: int, tec_id: int, data: CausaTecnicaCreate, db: Session = Depends(get_db)):
    obj = db.query(models.CausaTecnica).filter(
        models.CausaTecnica.id == tec_id,
        models.CausaTecnica.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/causas/{causa_id}/tecnicas/{tec_id}", status_code=204)
def delete_tecnica(causa_id: int, tec_id: int, db: Session = Depends(get_db)):
    obj = db.query(models.CausaTecnica).filter(
        models.CausaTecnica.id == tec_id,
        models.CausaTecnica.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")
    db.delete(obj)
    db.commit()


@router.put("/causas/{causa_id}/tecnicas/bulk", response_model=CausaTecnicasList)
def bulk_update_tecnicas(causa_id: int, data: List[CausaTecnicaCreate], db: Session = Depends(get_db)):
    db.query(models.CausaTecnica).filter(models.CausaTecnica.causa_id == causa_id).delete()
    nuevas = [models.CausaTecnica(**{**d.model_dump(), "causa_id": causa_id}) for d in data]
    db.add_all(nuevas)
    db.commit()
    items = db.query(models.CausaTecnica).filter(models.CausaTecnica.causa_id == causa_id).all()
    return CausaTecnicasList(tecnicas=[CausaTecnicaResponse.model_validate(i) for i in items], total=len(items))


# ─────────────────────────────────────────────────────────────────────────────
# OFICIOS / ELEVACIÓN
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/causas/{causa_id}/oficios", response_model=CausaOficiosList)
def get_oficios(causa_id: int, db: Session = Depends(get_db)):
    items = db.query(models.CausaOficio).filter(models.CausaOficio.causa_id == causa_id).all()
    return CausaOficiosList(oficios=[CausaOficioResponse.model_validate(i) for i in items], total=len(items))


@router.post("/causas/{causa_id}/oficios", response_model=CausaOficioResponse)
def create_oficio(causa_id: int, data: CausaOficioCreate, db: Session = Depends(get_db)):
    obj = models.CausaOficio(**{**data.model_dump(), "causa_id": causa_id})
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/causas/{causa_id}/oficios/{oficio_id}", response_model=CausaOficioResponse)
def update_oficio(causa_id: int, oficio_id: int, data: CausaOficioCreate, db: Session = Depends(get_db)):
    obj = db.query(models.CausaOficio).filter(
        models.CausaOficio.id == oficio_id,
        models.CausaOficio.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Oficio no encontrado")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/causas/{causa_id}/oficios/{oficio_id}", status_code=204)
def delete_oficio(causa_id: int, oficio_id: int, db: Session = Depends(get_db)):
    obj = db.query(models.CausaOficio).filter(
        models.CausaOficio.id == oficio_id,
        models.CausaOficio.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Oficio no encontrado")
    db.delete(obj)
    db.commit()


@router.put("/causas/{causa_id}/oficios/bulk", response_model=CausaOficiosList)
def bulk_update_oficios(causa_id: int, data: List[CausaOficioCreate], db: Session = Depends(get_db)):
    db.query(models.CausaOficio).filter(models.CausaOficio.causa_id == causa_id).delete()
    nuevos = [models.CausaOficio(**{**d.model_dump(), "causa_id": causa_id}) for d in data]
    db.add_all(nuevos)
    db.commit()
    items = db.query(models.CausaOficio).filter(models.CausaOficio.causa_id == causa_id).all()
    return CausaOficiosList(oficios=[CausaOficioResponse.model_validate(i) for i in items], total=len(items))
