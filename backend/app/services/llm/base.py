from abc import ABC, abstractmethod
from typing import Type
from pydantic import BaseModel
from app.schemas.clinical import LLMExtractionResult, StructuredSummaryResult

class BaseLLMProvider(ABC):
    """
    Abstract base class for LLM Providers (Ollama, Groq, Gemini).
    """
    
    @abstractmethod
    async def extract_clinical_fact(self, text: str, target_slot: str, schema_cls: Type[BaseModel]) -> LLMExtractionResult:
        """
        Extracts clinical facts from the provided text according to the target slot's schema.
        
        Args:
            text: The raw patient response.
            target_slot: The name of the slot to extract (e.g. 'chief_complaint').
            schema_cls: The Pydantic model representing the expected output schema.
            
        Returns:
            LLMExtractionResult containing the extracted dict, evidence, confidence, and status.
        """
        pass

    def generate_structured_summary(self, prompt: str) -> StructuredSummaryResult:
        """
        Generates an evidence-backed clinical summary draft from confirmed facts.
        
        Args:
            prompt: Formatted prompt containing confirmed clinical facts and allowed evidence IDs.
            
        Returns:
            StructuredSummaryResult containing structured narrative sections and evidence IDs.
        """
        raise NotImplementedError("Summary generation is not implemented for this provider")
