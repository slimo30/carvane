from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from app.config import settings
from pymongo import AsyncMongoClient
from beanie import init_beanie

from src.minio import init_minio_client
# from app.models.appointemnt import Appointment
# from app.models.material import Material
# from app.models.order import Order
# from app.api.notif import router as notif_router
# from src.models.notification import notification
from fastapi.middleware.cors import CORSMiddleware


mongo_client = AsyncMongoClient(settings.MONGO_URI)
mongo_db = mongo_client[settings.MONGO_DB]


async def init_mongo():
    await init_beanie(database=mongo_db, document_models=[])
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_mongo()
    await init_minio_client(
        minio_host=settings.MINIO_HOST,
        minio_port=settings.MINIO_PORT,
        minio_root_user=settings.MINIO_ROOT_USER,
        minio_root_password=settings.MINIO_ROOT_PASSWORD
        
  
    )
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[*settings.allowed_origins_list], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

