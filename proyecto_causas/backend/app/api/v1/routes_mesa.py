from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db
from app.schemas import MesaEntrada, MesaEntradaCreate, MesaEntradasListResponse


router = APIRouter()


@router.post("/mesa", response_model=MesaEntradasListResponse)
def get_mesa_entradas(db: Session = Depends(get_db)):
    """
    Listar todas las entradas de mesa.
    POST con body vacío (mismo patrón que /causas).
    """
    entradas = db.query(models.MesaEntrada).order_by(models.MesaEntrada.id.desc()).all()
    return MesaEntradasListResponse(
        entradas=[MesaEntrada.from_orm(e) for e in entradas],
        total=len(entradas),
    )


@router.post("/mesa/alta", response_model=MesaEntrada)
def crear_mesa_entrada(data: MesaEntradaCreate, db: Session = Depends(get_db)):
    """Crear una nueva entrada de mesa."""
    nueva = models.MesaEntrada(
        fecha=data.fecha,
        procedencia=data.procedencia,
        remitente=data.remitente,
        juzgado=data.juzgado,
        fiscalia=data.fiscalia,
        descripcion=data.descripcion,
        nro_causa=data.nro_causa,
        obs=data.obs,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return MesaEntrada.from_orm(nueva)


@router.put("/mesa/{entrada_id}", response_model=MesaEntrada)
def actualizar_mesa_entrada(entrada_id: int, data: MesaEntradaCreate, db: Session = Depends(get_db)):
    """Actualizar una entrada de mesa existente."""
    entrada = db.query(models.MesaEntrada).filter(models.MesaEntrada.id == entrada_id).first()
    if not entrada:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")

    entrada.fecha = data.fecha
    entrada.procedencia = data.procedencia
    entrada.remitente = data.remitente
    entrada.juzgado = data.juzgado
    entrada.fiscalia = data.fiscalia
    entrada.descripcion = data.descripcion
    entrada.nro_causa = data.nro_causa
    entrada.obs = data.obs

    db.commit()
    db.refresh(entrada)
    return MesaEntrada.from_orm(entrada)


@router.delete("/mesa/{entrada_id}")
def eliminar_mesa_entrada(entrada_id: int, db: Session = Depends(get_db)):
    """Eliminar una entrada de mesa."""
    entrada = db.query(models.MesaEntrada).filter(models.MesaEntrada.id == entrada_id).first()
    if not entrada:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")

    db.delete(entrada)
    db.commit()
    return {"message": "Entrada eliminada correctamente", "id": entrada_id}
