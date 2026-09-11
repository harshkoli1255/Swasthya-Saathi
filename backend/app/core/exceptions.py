from fastapi import HTTPException, status


class AppError(HTTPException):
    """Base application error."""


class NotFoundError(AppError):
    def __init__(self, resource: str, id: str | None = None):
        detail = f"{resource} not found" if not id else f"{resource} '{id}' not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class UnauthorizedError(AppError):
    def __init__(self, detail: str = "Authentication required"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenError(AppError):
    def __init__(self, detail: str = "Access denied"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ConflictError(AppError):
    def __init__(self, detail: str = "Resource already exists or state conflict"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class InvalidStateTransitionError(AppError):
    def __init__(self, current: str, attempted: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot transition from '{current}' to '{attempted}'",
        )


class ValidationError(AppError):
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

class LLMProviderError(AppError):
    def __init__(self, detail: str = "LLM Provider failed"):
        super().__init__(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)
