from contextlib import asynccontextmanager
from fastapi  import  FastAPI


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



