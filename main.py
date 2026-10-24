
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine
from student_controller import routers as student_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Student Result Management System")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(student_router)

app.mount(
    "/",
    StaticFiles(directory="frontend", html=True),
    name="frontend"
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
