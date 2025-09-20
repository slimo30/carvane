from fastapi import HTTPException
from typing import Any, Dict, Optional


class BaseAPIException(Exception):
    """Base exception for API errors"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        headers: Optional[Dict[str, Any]] = None
    ):
        self.status_code = status_code
        self.detail = detail
        self.headers = headers
        super().__init__(detail)


class BadRequest(BaseAPIException):
    """400 Bad Request"""
    
    def __init__(self, detail: str = "Bad Request"):
        super().__init__(400, detail)


class Unauthorized(BaseAPIException):
    """401 Unauthorized"""
    
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(401, detail)


class Forbidden(BaseAPIException):
    """403 Forbidden"""
    
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(403, detail)


class NotFound(BaseAPIException):
    """404 Not Found"""
    
    def __init__(self, detail: str = "Not Found"):
        super().__init__(404, detail)


class InternalServerError(BaseAPIException):
    """500 Internal Server Error"""
    
    def __init__(self, detail: str = "Internal Server Error"):
        super().__init__(500, detail)


# Create a module-level exceptions object for easy access
class exceptions:
    BadRequest = BadRequest
    Unauthorized = Unauthorized
    Forbidden = Forbidden
    NotFound = NotFound
    InternalServerError = InternalServerError
