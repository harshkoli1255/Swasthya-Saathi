import logging
from typing import Type
from pydantic import BaseModel
from app.core.config import settings
from app.core.exceptions import LLMProviderError
from app.schemas.clinical import LLMExtractionResult
from .ollama import OllamaProvider
from .cloud import GroqProvider
from .gemini import GeminiProvider

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.ollama = OllamaProvider()
        self.groq = GroqProvider()
        self.gemini = GeminiProvider()
        
    async def extract_clinical_fact(self, text: str, target_slot: str, schema_cls: Type[BaseModel]) -> LLMExtractionResult | None:
        """
        Attempts to extract a clinical fact using configured providers.
        Supports Groq, Gemini, and Ollama with fallback chains.
        Returns None on total AI failure (triggering deterministic fallback upstream).
        """
        providers = []
        
        # Primary Provider
        if settings.ai_primary_provider == "groq":
            providers.append(("Groq", self.groq))
        elif settings.ai_primary_provider == "gemini":
            providers.append(("Gemini", self.gemini))
        elif settings.ai_primary_provider == "ollama":
            providers.append(("Ollama", self.ollama))
            
        # Fallbacks
        if settings.feature_cloud_ai_fallback:
            if settings.ai_primary_provider != "groq":
                providers.append(("Groq", self.groq))
            if settings.ai_primary_provider != "gemini":
                providers.append(("Gemini", self.gemini))
        if settings.ai_primary_provider != "ollama":
            providers.append(("Ollama", self.ollama))
            
        # Deduplicate while preserving order
        seen = set()
        unique_providers = []
        for name, provider in providers:
            if name not in seen:
                seen.add(name)
                unique_providers.append((name, provider))
                
        # Try providers in order
        for name, provider in unique_providers:
            try:
                logger.info(f"Attempting {name} extraction for slot {target_slot}")
                result = await provider.extract_clinical_fact(text, target_slot, schema_cls)
                if result:
                    return result
            except (LLMProviderError, RuntimeError, ValueError, TimeoutError) as e:
                logger.warning(f"{name} failed: {e}")
                
        # Total AI failure triggers deterministic fallback upstream
        return None
