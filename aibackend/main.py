from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from src.config import settings
from pymongo import AsyncMongoClient
from beanie import init_beanie

from src.minio import init_minio_client
from src.models.conversation import Conversation, Message
from src.models.payament import Payment
from src.router.payment_router import router as payment_router
from src.router.ai_agent_router import router as ai_agent_router
from fastapi.middleware.cors import CORSMiddleware


mongo_client = AsyncMongoClient(settings.mongodb_url)
mongo_db = mongo_client[settings.mongodb_database]


async def init_mongo():
    await init_beanie(
        database=mongo_db, 
        document_models=[Conversation, Message, Payment]
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_mongo()
    await init_minio_client(
        minio_host=settings.minio_endpoint.split(':')[0],
        minio_port=int(settings.minio_endpoint.split(':')[1]),
        minio_root_user=settings.minio_access_key,
        minio_root_password=settings.minio_secret_key
    )
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list, 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

# Include routers
app.include_router(payment_router, prefix="/api")
app.include_router(ai_agent_router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "carvane-ai-backend",
        "version": settings.app_version
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Carvane AI Backend",
        "version": settings.app_version,
        "docs": "/docs"
    }

