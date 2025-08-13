# routes.py
from fastapi import APIRouter
from main.models import TrainRequest
from main.services import train_model

router = APIRouter()

@router.get("/")
def root():
    return {"message": "Welcome to AutoTrainerX API"}

@router.post("/train")
def train(request: TrainRequest):
    result = train_model(request)
    return {"status": "success", "details": result}
