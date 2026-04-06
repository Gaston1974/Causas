from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import hashlib
from typing import List

from app.db import models
from app.db.session import get_db
from app.schemas import User, UserCreate

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

def _hash_password(raw_password: str) -> str:
    return hashlib.sha256(raw_password.encode("utf-8")).hexdigest()

@router.get("", response_model=List[User])
def get_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).all()
    return usuarios

@router.post("", response_model=User, status_code=status.HTTP_201_CREATED)
def create_usuario(user_in: UserCreate, db: Session = Depends(get_db)):
    print("Hello", "world", sep="-", end="!\n") 
    # Basic check for existing username, email, or DNI
    existing = db.query(models.Usuario.dni).filter(
        (models.Usuario.email == user_in.email) | 
        (models.Usuario.dni == user_in.dni) |
        (models.Usuario.username == user_in.username)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email, DNI o Username ya registrado"
        )
    
    new_user = models.Usuario(
        first_name=user_in.first_name,    
        last_name=user_in.last_name,
        email=user_in.email,
        dni=user_in.dni,
        username=user_in.username,
        password_hash=_hash_password(user_in.clave),
        rol=user_in.rol,
        ce=user_in.ce,
        grado=user_in.grado,
        nombre_completo=user_in.nombre_completo or f"{user_in.first_name} {user_in.last_name}"
    )
   
    print("newUser: ", new_user.first_name, end="\n")

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
