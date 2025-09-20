from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # MongoDB Configuration
    mongodb_url: str = "mongodb://root:example@mongodb:27017"
    mongodb_database: str = "carvane_ai"
    
    # MinIO Configuration
    minio_endpoint: str = "minio:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin123"
    minio_bucket_name: str = "carvane-ai-files"
    minio_secure: bool = False
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    
    # Chargily Configuration
    chargily_api_key: Optional[str] = None
    chargily_secret_key: Optional[str] = None
    chargily_base_url: str = "https://pay.chargily.com/test/v2"
    chargily_webhook_secret: Optional[str] = None
    
    # Application Configuration
    app_name: str = "Carvane AI Backend"
    app_version: str = "1.0.0"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8001
    
    # CORS Configuration
    allowed_origins: str = "http://localhost:3000,http://localhost:3001"
    
    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
