from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def test_users():
    return {"folders": "ok"}