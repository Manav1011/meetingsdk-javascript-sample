from fastapi import FastAPI, HTTPException
import httpx
import base64
import os
from pydantic import BaseModel
from jose import jwt
import time
from datetime import datetime, timezone
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

CLIENT_ID = "mPcTd93nRseLmbMesNP1Cw"
CLIENT_SECRET = "zTFToTOs7CseRL3p7Zh4uR5dhBVJ5SUF"
ACCOUNT_ID = "57tQLQJgTcm94krYW0znUw"
API_BASE_URL = "https://api.zoom.us/v2"
TOKEN_URL = "https://zoom.us/oauth/token"
ZOOM_MEETING_SDK_KEY="GVkI9tvlSEasIJ_WSNL0UA"
ZOOM_MEETING_SDK_SECRET="TLDgM3nPUNO3s9SuuBDYsgQgSOHx76CP"

class MeetingRequest(BaseModel):
    email: str

class SignatureRequest(BaseModel):
    meetingNumber: str
    role: int
    expirationSeconds: int = 7200

async def get_access_token():
    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            TOKEN_URL,
            data={"grant_type": "account_credentials", "account_id": ACCOUNT_ID},
            headers={
                "Authorization": f"Basic {auth_header}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()["access_token"]

async def create_meeting(access_token, email):
    async with httpx.AsyncClient() as client:
        current_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")  # Get current UTC time
        response = await client.post(
            f"{API_BASE_URL}/users/{email}/meetings",
            json={
                "topic": "Test meeting",
                "type": 2,
                "start_time":current_time,
                "duration": 60,
                "timezone": "UTC",
                "password": "123456",
                "agenda": "Discuss project updates",
            },
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
        )
        if response.status_code != 201:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()

async def get_user_zak_token(access_token,email):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_BASE_URL}/users/{email}/token",
            headers={"Authorization": f"Bearer {access_token}"},
            params={"type": "zak"},
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()["token"]

@app.post("/create_meeting")
async def create_meeting_endpoint(request: MeetingRequest):
    try:
        access_token = await get_access_token()
        meeting_data = await create_meeting(access_token, request.email)
        zak_token = await get_user_zak_token(access_token,request.email)
        return {"join_url": meeting_data['join_url'], "zak": zak_token}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_signature")
async def generate_signature(request: SignatureRequest):
    try:
        iat = int(time.time())
        exp = iat + request.expirationSeconds if request.expirationSeconds else iat + 60 * 60 * 2
        oHeader = {"alg": "HS256", "typ": "JWT"}
        oPayload = {
            "appKey": ZOOM_MEETING_SDK_KEY,
            "sdkKey": ZOOM_MEETING_SDK_KEY,
            "mn": request.meetingNumber,
            "role": request.role,
            "iat": iat,
            "exp": exp,
            "tokenExp": exp
        }
        signature = jwt.encode(oPayload, ZOOM_MEETING_SDK_SECRET, algorithm="HS256")
        return {"signature": signature,'sdkKey':ZOOM_MEETING_SDK_KEY}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
