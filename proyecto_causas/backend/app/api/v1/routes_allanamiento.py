"""
routes_allanamiento.py
Upsert completo del allanamiento de una causa (cabecera + 9 sub-módulos).
El endpoint PUT /causas/{causa_id}/allanamiento reemplaza TODO el allanamiento
en una sola operación atómica.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db
from app.schemas import (
    CausaAllanamientoCreate,
    CausaAllanamientoResponse,
)

router = APIRouter()


def _build_response(obj: models.CausaAllanamiento) -> CausaAllanamientoResponse:
    return CausaAllanamientoResponse.model_validate(obj)


# ─────────────────────────────────────────────────────────────────────────────
# GET — devuelve el allanamiento completo con todos sus sub-módulos
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/causas/{causa_id}/allanamiento", response_model=CausaAllanamientoResponse)
def get_allanamiento(causa_id: int, db: Session = Depends(get_db)):
    obj = (
        db.query(models.CausaAllanamiento)
        .filter(models.CausaAllanamiento.causa_id == causa_id)
        .first()
    )
    if not obj:
        raise HTTPException(status_code=404, detail="Allanamiento no registrado para esta causa")
    return _build_response(obj)


# ─────────────────────────────────────────────────────────────────────────────
# PUT — upsert completo (crea o reemplaza la cabecera y TODOS los sub-módulos)
# ─────────────────────────────────────────────────────────────────────────────

@router.put("/causas/{causa_id}/allanamiento", response_model=CausaAllanamientoResponse)
def upsert_allanamiento(causa_id: int, data: CausaAllanamientoCreate, db: Session = Depends(get_db)):
    """
    Crea o reemplaza el registro de allanamiento completo de una causa.
    Borra y re-inserta todos los sub-módulos en una transacción atómica.
    """
    # ── 1. Cabecera ──────────────────────────────────────────────────────────
    cab = (
        db.query(models.CausaAllanamiento)
        .filter(models.CausaAllanamiento.causa_id == causa_id)
        .first()
    )
    if cab:
        cab.positivo = data.positivo
        cab.fecha_allanamiento = data.fecha_allanamiento
        cab.observaciones = data.observaciones
    else:
        cab = models.CausaAllanamiento(
            causa_id=causa_id,
            positivo=data.positivo,
            fecha_allanamiento=data.fecha_allanamiento,
            observaciones=data.observaciones,
        )
        db.add(cab)
        db.flush()  # necesitamos el id de la cabecera

    allanamiento_id = cab.id

    # ── 2. Limpiar sub-módulos existentes ────────────────────────────────────
    for SubModel in [
        models.AllanamientoDomicilio,
        models.AllanamientoArma,
        models.AllanamientoVehiculo,
        models.AllanamientoCigarrillo,
        models.AllanamientoEstupefaciente,
        models.AllanamientoDivisa,
        models.AllanamientoDetenido,
        models.AllanamientoRescatado,
        models.AllanamientoTecnologia,
    ]:
        db.query(SubModel).filter(SubModel.allanamiento_id == allanamiento_id).delete()

    # ── 3. Re-insertar sub-módulos ───────────────────────────────────────────
    def _insert_sub(SubModel, items_data):
        for item in items_data:
            obj = SubModel(**{**item.model_dump(), "allanamiento_id": allanamiento_id})
            db.add(obj)

    _insert_sub(models.AllanamientoDomicilio, data.domicilios)
    _insert_sub(models.AllanamientoArma, data.armas)
    _insert_sub(models.AllanamientoVehiculo, data.vehiculos)
    _insert_sub(models.AllanamientoCigarrillo, data.cigarrillos)
    _insert_sub(models.AllanamientoEstupefaciente, data.estupefacientes)
    _insert_sub(models.AllanamientoDivisa, data.divisas)
    _insert_sub(models.AllanamientoDetenido, data.detenidos)
    _insert_sub(models.AllanamientoRescatado, data.rescatados)
    _insert_sub(models.AllanamientoTecnologia, data.tecnologia)

    db.commit()
    db.refresh(cab)
    return _build_response(cab)


# ─────────────────────────────────────────────────────────────────────────────
# DELETE — borra el allanamiento completo (cascada)
# ─────────────────────────────────────────────────────────────────────────────

@router.delete("/causas/{causa_id}/allanamiento", status_code=204)
def delete_allanamiento(causa_id: int, db: Session = Depends(get_db)):
    obj = (
        db.query(models.CausaAllanamiento)
        .filter(models.CausaAllanamiento.causa_id == causa_id)
        .first()
    )
    if not obj:
        raise HTTPException(status_code=404, detail="Allanamiento no encontrado")
    db.delete(obj)
    db.commit()
