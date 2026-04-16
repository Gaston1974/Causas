from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import hashlib

from app.db import models
from app.db.session import get_db
from app.schemas import LoginRequest, LoginResponse, User


router = APIRouter()


def _hash_password(raw_password: str) -> str:
    # Replica simple del hash que hacía el backend Go (sha256 en hexadecimal)
    return hashlib.sha256(raw_password.encode("utf-8")).hexdigest()


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint de login compatible con el frontend actual.

    Intenta encontrar el usuario por:
    - dni
    - ce
    - username
    - email
    (en ese orden).
    """
    if not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password requerido",
        )

    hashed = _hash_password(payload.password)

    query = db.query(models.Usuario)

    identifier = (
        payload.dni
        or payload.ce
        or payload.username
        or payload.email
    )

    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Falta identificador (dni, ce, username o email)",
        )

    user = (
        query.filter(
            models.Usuario.password_hash == hashed,
            (
                (models.Usuario.dni == identifier)
                | (models.Usuario.ce == identifier)
                | (models.Usuario.username == identifier)
                | (models.Usuario.email == identifier)
            ),
        )
        .limit(1)
        .one_or_none()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    token = str(user.id)

    return LoginResponse(
        token=token,
        requires2FA=False,
        user=User.from_orm(user),
        message="Login exitoso",
    )

