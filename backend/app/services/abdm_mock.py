import uuid
from typing import Dict, Any, Tuple, Optional
import asyncio

class MockABDMGateway:
    """
    Simulates the ABDM Gateway for FHIR Sync.
    100% Mock / Sandbox boundary. No production claims.
    """
    @staticmethod
    async def sync_clinical_record(bundle: Dict[str, Any]) -> Tuple[bool, str, Optional[str], Optional[str]]:
        """
        Simulates network latency and ABDM responses based on deterministic rules or random chance.
        Returns: (success, status, failure_code, failure_reason)
        """
        await asyncio.sleep(0.5) # Simulate latency
        
        # We can implement deterministic testing hooks using patient ABHA or bundle ID.
        # Let's inspect the Patient resource ABHA to trigger deterministic failures for testing.
        abha_number = None
        for entry in bundle.get("entry", []):
            res = entry.get("resource", {})
            if res.get("resourceType") == "Patient":
                for identifier in res.get("identifier", []):
                    if identifier.get("system") == "https://healthid.ndhm.gov.in":
                        abha_number = identifier.get("value")
                        break
                        
        if abha_number == "FAIL-500":
            return False, "FAILED", "500", "Simulated Gateway Timeout/Unavailable"
            
        if abha_number == "FAIL-400":
            return False, "FAILED", "400", "Simulated FHIR Validation Rejection from ABDM"
            
        # Basic structural validation check to simulate real gateway structural checks
        if bundle.get("resourceType") != "Bundle" or bundle.get("type") != "document":
            return False, "FAILED", "400", "ABDM expects Bundle.type = 'document'"
            
        # Default success
        return True, "SUCCESS", None, None
