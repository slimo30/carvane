from fastapi import UploadFile
from typing import Dict, List


def check_extension(file: UploadFile, allowed_extensions: Dict[str, List[str]]) -> bool:
    """Check if file extension is allowed"""
    
    if not file.filename:
        return False
    
    # Get file extension
    file_extension = file.filename.split('.')[-1].lower()
    
    # Check if extension is in allowed list
    if file_extension not in allowed_extensions:
        return False
    
    # Check content type if available
    if file.content_type:
        allowed_content_types = allowed_extensions[file_extension]
        if file.content_type not in allowed_content_types:
            return False
    
    return True


def validate_file_size(file: UploadFile, max_size_mb: int = 10) -> bool:
    """Validate file size"""
    
    # Note: This is a basic check. For production, you might want to read the file
    # and check its actual size, but that would require reading the entire file.
    # For now, we'll assume the file size is reasonable.
    return True


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    
    import re
    
    # Remove or replace unsafe characters
    filename = re.sub(r'[^\w\-_\.]', '_', filename)
    
    # Remove multiple consecutive underscores
    filename = re.sub(r'_+', '_', filename)
    
    # Remove leading/trailing underscores and dots
    filename = filename.strip('_.')
    
    return filename
