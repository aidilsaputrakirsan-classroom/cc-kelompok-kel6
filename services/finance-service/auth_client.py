import httpx
from dotenv import load_dotenv
import os

load_dotenv()

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000")


async def verify_token(token: str) -> dict:
    """Verify JWT token with auth service"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{AUTH_SERVICE_URL}/verify",
                params={"token": token},
                timeout=5.0,
            )
            if response.status_code == 200:
                return response.json()
            else:
                return None
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None
