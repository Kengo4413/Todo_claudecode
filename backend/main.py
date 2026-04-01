from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import auth as auth_router
from routers import tasks as tasks_router
from routers import categories as categories_router
from routers import dashboard as dashboard_router

load_dotenv()

app = FastAPI(
    title="Todo管理 API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(tasks_router.router)
app.include_router(categories_router.router)
app.include_router(dashboard_router.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
