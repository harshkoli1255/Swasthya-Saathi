import time
from fastapi import Request, HTTPException
from collections import defaultdict
import threading

class RateLimiter:
    def __init__(self, requests: int, window: int):
        self.requests = requests
        self.window = window
        self.history = defaultdict(list)
        self.lock = threading.Lock()

    def __call__(self, request: Request):
        # Use client IP or token if available
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path
        key = f"{client_ip}:{path}"
        
        now = time.time()
        
        with self.lock:
            # Filter history to only include recent requests
            self.history[key] = [t for t in self.history[key] if now - t < self.window]
            
            if len(self.history[key]) >= self.requests:
                # Need to return Retry-After header
                wait_time = int(self.window - (now - self.history[key][0]))
                headers = {"Retry-After": str(wait_time)}
                raise HTTPException(
                    status_code=429, 
                    detail="Too Many Requests", 
                    headers=headers
                )
                
            self.history[key].append(now)

import os

# Configurable Default limits
LOGIN_RATE_LIMIT = int(os.getenv("LOGIN_RATE_LIMIT", "5"))
INTAKE_RATE_LIMIT = int(os.getenv("INTAKE_RATE_LIMIT", "15"))
MEDIA_RATE_LIMIT = int(os.getenv("MEDIA_RATE_LIMIT", "5"))
EXPORT_RATE_LIMIT = int(os.getenv("EXPORT_RATE_LIMIT", "3"))

login_limiter = RateLimiter(requests=LOGIN_RATE_LIMIT, window=60)
public_intake_limiter = RateLimiter(requests=INTAKE_RATE_LIMIT, window=60)
media_limiter = RateLimiter(requests=MEDIA_RATE_LIMIT, window=60)
export_limiter = RateLimiter(requests=EXPORT_RATE_LIMIT, window=60)
