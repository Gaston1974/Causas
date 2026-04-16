from fastapi import APIRouter


router = APIRouter()


@router.get("/combos/provincias")
def get_provincias():
    # Placeholder simple; se puede conectar luego a tabla real
    return [
        {"id": "1", "nombre": "SANTIAGO DEL ESTERO"},
        {"id": "2", "nombre": "BUENOS AIRES"},
    ]


@router.get("/combos/localidades")
def get_localidades():
    return []


@router.get("/combos/fiscalias")
def get_fiscalias():
    return []


@router.get("/combos/juzgados")
def get_juzgados():
    return []


@router.get("/combos/preventores")
def get_preventores():
    return []

