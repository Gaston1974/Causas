"""
routes_sgo.py
CRUD de vinculaciones SGO-Causa.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import models
from app.db.session import get_db
from app.schemas import CausaSGOCreate, CausaSGOResponse, CausaSGOsList

router = APIRouter()


@router.get("/causas/{causa_id}/sgos", response_model=CausaSGOsList)
def get_sgos(causa_id: int, db: Session = Depends(get_db)):
    items = db.query(models.CausaSGO).filter(models.CausaSGO.causa_id == causa_id).all()
    return CausaSGOsList(sgos=[CausaSGOResponse.model_validate(i) for i in items], total=len(items))


@router.post("/causas/{causa_id}/sgos", response_model=CausaSGOResponse)
def create_sgo(causa_id: int, data: CausaSGOCreate, db: Session = Depends(get_db)):
    obj = models.CausaSGO(**{**data.model_dump(), "causa_id": causa_id})
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return CausaSGOResponse.model_validate(obj)


@router.put("/causas/{causa_id}/sgos/{sgo_id}", response_model=CausaSGOResponse)
def update_sgo(causa_id: int, sgo_id: int, data: CausaSGOCreate, db: Session = Depends(get_db)):
    obj = db.query(models.CausaSGO).filter(
        models.CausaSGO.id == sgo_id,
        models.CausaSGO.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="SGO no encontrado")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return CausaSGOResponse.model_validate(obj)


@router.delete("/causas/{causa_id}/sgos/{sgo_id}", status_code=204)
def delete_sgo(causa_id: int, sgo_id: int, db: Session = Depends(get_db)):
    obj = db.query(models.CausaSGO).filter(
        models.CausaSGO.id == sgo_id,
        models.CausaSGO.causa_id == causa_id
    ).first()
    if not obj:
        raise HTTPException(status_code=404, detail="SGO no encontrado")
    db.delete(obj)
    db.commit()


@router.put("/causas/{causa_id}/sgos/bulk", response_model=CausaSGOsList)
def bulk_update_sgos(causa_id: int, data: List[CausaSGOCreate], db: Session = Depends(get_db)):
    """Reemplaza toda la lista de SGOs de una causa."""
    db.query(models.CausaSGO).filter(models.CausaSGO.causa_id == causa_id).delete()
    nuevos = [models.CausaSGO(**{**d.model_dump(), "causa_id": causa_id}) for d in data]
    db.add_all(nuevos)
    db.commit()
    items = db.query(models.CausaSGO).filter(models.CausaSGO.causa_id == causa_id).all()
    return CausaSGOsList(sgos=[CausaSGOResponse.model_validate(i) for i in items], total=len(items))
