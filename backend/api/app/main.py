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


from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request, status

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = {}

    for err in exc.errors():
        field = err["loc"][1]

        message = err.get("ctx", {}).get("reason")

        if not message:
            message = err["msg"]

        errors[field] = message

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": errors},
    )


from app.api.routes import auth, users, folders

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(folders.router, prefix="/folders", tags=["folders"])



print("PYTHON:", sys.executable)
print("FILE:", __file__)
print("ALL ROUTES:", [r.path for r in app.routes])