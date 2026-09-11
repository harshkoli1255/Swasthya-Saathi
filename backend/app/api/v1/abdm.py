import uuid
import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.rate_limit import public_intake_limiter
from app.models.session import IntakeSession
from app.schemas.intake import (
    ABDMStatusResponse,
    ABDMRequestOTPPayload,
    ABDMRequestOTPResponse,
    ABDMVerifyOTPPayload,
    ABDMVerifyOTPResponse
)
from app.services.abdm import get_abdm_adapter, ABDMAuditService, ABDMProfile

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/abdm", tags=["abdm"])


def get_session_by_token(public_token: str, db: Session) -> IntakeSession:
    session = db.query(IntakeSession).filter(IntakeSession.public_token == public_token).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired intake session"
        )
    return session


@router.get("/status", response_model=ABDMStatusResponse)
async def get_abdm_status():
    """
    Returns the active ABDM integration status, environment, and supported auth modes.
    Never exposes client secrets or private tokens.
    """
    adapter = get_abdm_adapter()
    is_configured = bool(settings.abdm_client_id and settings.abdm_client_secret)
    is_sandbox = (settings.abdm_env or "").lower() == "sandbox"

    return ABDMStatusResponse(
        environment=adapter.environment_name,
        is_sandbox=is_sandbox,
        is_configured=is_configured or adapter.environment_name == "LOCAL_DEV_MOCK",
        gateway_url=settings.abdm_gateway_url,
        supported_methods=["AADHAAR_OTP", "ABHA_OTP", "MOBILE_OTP", "SCAN_AND_SHARE"]
    )


@router.post("/{public_token}/request-otp", response_model=ABDMRequestOTPResponse, dependencies=[Depends(public_intake_limiter)])
async def request_abdm_otp(
    request: Request,
    public_token: str,
    payload: ABDMRequestOTPPayload,
    db: Session = Depends(get_db)
):
    """
    Requests a real OTP from official NHA ABDM Gateway for the given patient intake session.
    """
    session = get_session_by_token(public_token, db)
    adapter = get_abdm_adapter()

    # Determine loginHint and otpSystem according to official NHA specifications
    mode = payload.auth_mode.upper()
    identifier = payload.identifier.strip().replace("-", "").replace(" ", "")

    if mode == "AADHAAR_OTP":
        login_hint = "aadhaar"
        otp_system = "aadhaar"
        scope = ["abha-login", "aadhaar-verify"]
    elif mode == "ABHA_OTP":
        login_hint = "abha-number"
        otp_system = "abdm"
        scope = ["abha-login", "mobile-verify"]
    elif mode == "MOBILE_OTP":
        login_hint = "mobile"
        otp_system = "abdm"
        scope = ["abha-login", "mobile-verify"]
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported ABDM authentication mode: {payload.auth_mode}"
        )

    # Audit event: verification initiated
    ABDMAuditService.log_abdm_event(
        db=db,
        action="ABDM_OTP_REQUESTED",
        entity_id=session.encounter.patient_id,
        entity_type="PATIENT",
        after_state={"auth_mode": mode, "environment": adapter.environment_name}
    )
    db.commit()

    try:
        result = await adapter.request_otp(
            login_hint=login_hint,
            login_id=identifier,
            otp_system=otp_system,
            scope=scope
        )

        if not result.get("success"):
            return ABDMRequestOTPResponse(
                success=False,
                txn_id=None,
                message=result.get("error_message", "Failed to dispatch ABDM OTP"),
                error_code=result.get("error_code")
            )

        return ABDMRequestOTPResponse(
            success=True,
            txn_id=result.get("txn_id"),
            message=result.get("message", "OTP sent successfully")
        )

    except Exception as e:
        logger.error("Exception in request_abdm_otp: %s", str(e), exc_info=True)
        return ABDMRequestOTPResponse(
            success=False,
            txn_id=None,
            message=f"ABDM Gateway communication failed: {str(e)}",
            error_code="GATEWAY_ERROR"
        )


@router.post("/{public_token}/verify-otp", response_model=ABDMVerifyOTPResponse, dependencies=[Depends(public_intake_limiter)])
async def verify_abdm_otp(
    request: Request,
    public_token: str,
    payload: ABDMVerifyOTPPayload,
    db: Session = Depends(get_db)
):
    """
    Verifies OTP with official NHA ABDM Gateway, retrieves verified demographic profile,
    and binds identity to encounter session with strict clinical provenance.
    """
    session = get_session_by_token(public_token, db)
    adapter = get_abdm_adapter()

    mode = payload.auth_mode.upper()
    if mode == "AADHAAR_OTP":
        scope = ["abha-login", "aadhaar-verify"]
    else:
        scope = ["abha-login", "mobile-verify"]

    try:
        auth_result = await adapter.verify_otp(
            txn_id=payload.txn_id,
            otp_value=payload.otp.strip(),
            scope=scope
        )

        if not auth_result.success:
            ABDMAuditService.log_abdm_event(
                db=db,
                action="ABDM_OTP_VERIFY_FAILED",
                entity_id=session.encounter.patient_id,
                entity_type="PATIENT",
                after_state={"error": auth_result.message}
            )
            db.commit()

            return ABDMVerifyOTPResponse(
                success=False,
                verification_status="VERIFICATION_FAILED",
                verification_source=adapter.environment_name,
                verification_method=payload.auth_mode,
                patient_name=session.encounter.patient.full_name,
                abha_number="",
                abha_address="",
                message=auth_result.message or "Invalid OTP",
                error_code=auth_result.error_code or "INVALID_OTP"
            )

        # Retrieve profile using official /v3/profile/account if user token returned
        verified_profile: ABDMProfile
        if auth_result.token:
            try:
                verified_profile = await adapter.get_account_profile(auth_result.token)
            except Exception as pe:
                logger.warning("Profile endpoint fetch failed, falling back to accounts payload: %s", str(pe))
                # Fallback to account details in verify response
                acc = auth_result.accounts[0] if auth_result.accounts else {}
                verified_profile = ABDMProfile(
                    name=acc.get("name", session.encounter.patient.full_name),
                    abha_number=str(acc.get("ABHANumber", "")),
                    abha_address=str(acc.get("preferredAbhaAddress", "")),
                    raw_response=acc
                )
        else:
            acc = auth_result.accounts[0] if auth_result.accounts else {}
            verified_profile = ABDMProfile(
                name=acc.get("name", session.encounter.patient.full_name),
                abha_number=str(acc.get("ABHANumber", "")),
                abha_address=str(acc.get("preferredAbhaAddress", "")),
                raw_response=acc
            )

        # Reconcile patient demographics & record provenance
        patient = ABDMAuditService.reconcile_patient_demographics(
            db=db,
            encounter=session.encounter,
            verified_profile=verified_profile,
            verification_source=adapter.environment_name,
            verification_method=payload.auth_mode,
            verification_ref=auth_result.txn_id
        )

        db.commit()

        return ABDMVerifyOTPResponse(
            success=True,
            verification_status=patient.verification_status,
            verification_source=patient.verification_source,
            verification_method=patient.verification_method,
            patient_name=patient.full_name,
            abha_number=patient.abha_number or "",
            abha_address=patient.abha_address or "",
            age=patient.age,
            gender=patient.sex,
            message="Identity verified successfully via ABDM"
        )

    except Exception as e:
        logger.error("Exception in verify_abdm_otp: %s", str(e), exc_info=True)
        return ABDMVerifyOTPResponse(
            success=False,
            verification_status="VERIFICATION_FAILED",
            verification_source=adapter.environment_name,
            verification_method=payload.auth_mode,
            patient_name=session.encounter.patient.full_name,
            abha_number="",
            abha_address="",
            message=f"ABDM Gateway verification error: {str(e)}",
            error_code="GATEWAY_VERIFY_ERROR"
        )


@router.post("/{public_token}/scan-share", response_model=ABDMVerifyOTPResponse, dependencies=[Depends(public_intake_limiter)])
async def scan_and_share_checkin(
    request: Request,
    public_token: str,
    payload: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Processes verified patient demographic packet from ABDM Scan & Share (hospital counter QR).
    """
    session = get_session_by_token(public_token, db)
    adapter = get_abdm_adapter()

    try:
        result = await adapter.process_scan_and_share(payload)
        verified_profile: ABDMProfile = result["profile"]

        patient = ABDMAuditService.reconcile_patient_demographics(
            db=db,
            encounter=session.encounter,
            verified_profile=verified_profile,
            verification_source=adapter.environment_name,
            verification_method="SCAN_AND_SHARE",
            verification_ref=result.get("token_number")
        )

        db.commit()

        return ABDMVerifyOTPResponse(
            success=True,
            verification_status=patient.verification_status,
            verification_source=patient.verification_source,
            verification_method=patient.verification_method,
            patient_name=patient.full_name,
            abha_number=patient.abha_number or "",
            abha_address=patient.abha_address or "",
            age=patient.age,
            gender=patient.sex,
            message=f"Scan & Share verified. OPD Token: {result.get('token_number')}"
        )
    except Exception as e:
        logger.error("Exception in scan_and_share_checkin: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scan & Share processing failed: {str(e)}"
        )


@router.post("/hip/patient/share")
async def hip_patient_share_callback(payload: Dict[str, Any]):
    """
    Official NHA ABDM HIP Callback endpoint for Scan & Share:
    POST /api/v3/hip/patient/share
    Acknowledges receipt of shared profile from PHR application.
    """
    logger.info("ABDM HIP Callback received: intent=%s", payload.get("intent"))
    return {
        "status": "SUCCESS",
        "acknowledged": True,
        "tokenNumber": f"OPD-{uuid.uuid4().hex[:6].upper()}"
    }
