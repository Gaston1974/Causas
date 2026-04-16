from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.v1.routes_login import router as login_router
from app.api.v1.routes_causas import router as causas_router
from app.api.v1.routes_misc import router as misc_router
from app.api.v1.routes_mesa import router as mesa_router
from app.api.v1.routes_usuarios import router as usuarios_router
from app.api.v1.routes_extras import router as extras_router
from app.api.v1.routes_allanamiento import router as allanamiento_router
from app.api.v1.routes_sgo import router as sgo_router


settings = get_settings()

app = FastAPI(
    title="Causas Backend API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/v1/html/health")
def health():
    return {"status": "ok", "version": "2.0.0"}


app.include_router(login_router, prefix="/v1", tags=["auth"])
app.include_router(causas_router, prefix="/v1", tags=["causas"])
app.include_router(misc_router, prefix="/v1", tags=["combos"])
app.include_router(mesa_router, prefix="/v1", tags=["mesa"])
app.include_router(usuarios_router, prefix="/v1", tags=["usuarios"])
app.include_router(extras_router, prefix="/v1", tags=["extras"])
app.include_router(allanamiento_router, prefix="/v1", tags=["allanamiento"])
app.include_router(sgo_router, prefix="/v1", tags=["sgo"])
