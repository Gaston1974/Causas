from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db
from app.schemas import Causa, CausasListResponse


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

