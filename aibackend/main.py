from contextlib import asynccontextmanager
from fastapi  import  FastAPI
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient


AsyncIOMotorClient()
async def initilaie_mongo():
    pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # Shutdown code here
app = FastAPI()



app.post("/health")
async def health_check():
    return {"status": "ok"}



