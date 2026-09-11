from abc import ABC, abstractmethod
from typing import Optional

class BaseASRProcessor(ABC):
    @abstractmethod
    async def transcribe(self, file_path: str, mime_type: str) -> str:
        """
        Transcribes audio into raw text.
        """
        pass

class BaseDocumentProcessor(ABC):
    @abstractmethod
    async def extract_text(self, file_path: str, mime_type: str) -> str:
        """
        Extracts raw text from a document (PDF/Image).
        Preserves original document formatting as much as possible as a string.
        """
        pass
