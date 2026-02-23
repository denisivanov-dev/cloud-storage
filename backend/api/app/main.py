from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.routes import auth, users, folders, files

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(folders.router, prefix="/folders", tags=["folders"])
app.include_router(files.router, prefix="/files", tags=["files"])

print("PYTHON:", sys.executable)
print("FILE:", __file__)
print("ALL ROUTES:", [r.path for r in app.routes])