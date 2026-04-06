from functools import lru_cache
#from pydantic import BaseSettings
from pydantic_settings import BaseSettings   # ✅ new (v2)


class Settings(BaseSettings):
    # Dirección y puerto donde correrá FastAPI dentro de la VM
    APP_HOST: str = "10.50.22.142"
    APP_PORT: int = 8000

    # URL de conexión a la base de datos MySQL (equivalente a DBURL en el backend Go)
    # Ejemplo: mysql://user:password@localhost:3306/libros
    #DATABASE_URL: str = "mysql://user:password@localhost:3306/libros"
    DATABASE_URL: str = "mysql+pymysql://developer2:Viernes.1t@10.50.22.125:3306/sistemadecausas"
    #DATABASE_URL: str = "mysql://developer:Viernes.1t@10.50.22.125:3306/sistemadecausas"


    # Origen del frontend (Next.js) para CORS
    FRONTEND_ORIGIN: str = "http://10.50.22.142:3000"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()

