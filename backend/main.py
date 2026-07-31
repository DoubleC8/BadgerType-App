from contextlib import asynccontextmanager

from fastapi import FastAPI

from database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="BadgerType API", lifespan=lifespan)


@app.get("/health")
def health_check():
    return { "status": "ok" }