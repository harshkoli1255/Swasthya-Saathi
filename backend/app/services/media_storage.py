import os
import uuid
import hashlib
import aiofiles
from fastapi import UploadFile, HTTPException

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class MediaStorageService:
    @staticmethod
    async def save_upload(file: UploadFile, session_id: uuid.UUID) -> dict:
        """
        Saves an uploaded file to immutable local storage.
        Returns dict with path, mime, size, and sha256 hash.
        """
        # Validate MIME type (basic validation)
        allowed_mimes = {
            "image/jpeg": b"\xff\xd8\xff",
            "image/png": b"\x89PNG\r\n\x1a\n",
            "image/webp": b"RIFF", # Technically RIFF...WEBP
            "application/pdf": b"%PDF-", 
            "audio/wav": b"RIFF",
            "audio/webm": b"\x1aE\xdf\xa3",
            "audio/mpeg": (b"\x49\x44\x33", b"\xff\xfb"),
            "audio/ogg": b"OggS",
            "audio/mp4": b"\x00\x00\x00" # Simplified, ftyp is usually here
        }
        
        if file.content_type not in allowed_mimes:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
            
        header = await file.read(10)
        await file.seek(0)
        
        magic = allowed_mimes[file.content_type]
        if isinstance(magic, tuple):
            if not any(header.startswith(m) for m in magic):
                 raise HTTPException(status_code=400, detail="File signature mismatch (MIME spoofing detected)")
        else:
            if not header.startswith(magic):
                 raise HTTPException(status_code=400, detail="File signature mismatch (MIME spoofing detected)")
        
        # Sanitize filename strictly to prevent path traversal & double extension
        ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
        if not ext.isalnum() and ext.replace('.', '').isalnum() == False:
            ext = ""
        # Only allow single expected extensions
        allowed_exts = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".wav", ".webm", ".mp3", ".ogg", ".mp4", ".m4a"]
        if ext not in allowed_exts:
             raise HTTPException(status_code=400, detail=f"Unsupported or dangerous extension: {ext}")
            
        ext = os.path.splitext(file.filename)[1] if file.filename else ""
        safe_filename = f"{uuid.uuid4()}{ext}"
        
        # We partition by session ID to avoid a flat directory structure
        session_dir = os.path.join(UPLOAD_DIR, str(session_id))
        os.makedirs(session_dir, exist_ok=True)
        
        file_path = os.path.join(session_dir, safe_filename)
        
        sha256_hash = hashlib.sha256()
        
        # Reset file pointer just in case
        await file.seek(0)
        
        try:
            async with aiofiles.open(file_path, 'wb') as out_file:
                while content := await file.read(1024 * 1024):  # 1MB chunks
                    await out_file.write(content)
                    sha256_hash.update(content)
        except (OSError, IOError) as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
            
        # Optional: check file size (e.g. max 50MB)
        file_size = os.path.getsize(file_path)
        if file_size > 50 * 1024 * 1024:
            os.remove(file_path)
            raise HTTPException(status_code=413, detail="File too large (max 50MB)")
            
        return {
            "immutable_storage_ref": file_path,
            "mime_type": file.content_type,
            "sha256_hash": sha256_hash.hexdigest(),
            "size_bytes": file_size,
        }
