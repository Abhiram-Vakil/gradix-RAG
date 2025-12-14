from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, ingest
from services.chroma_db import check_db_connection
import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("\n" + "="*50)
    print("🚀 Starting Gradix Backend...")
    check_db_connection()
    print("="*50 + "\n")
    yield
    # Shutdown
    print("🛑 Shutting down...")

app = FastAPI(lifespan=lifespan)

# Configure CORS to allow requests from the React frontend
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router)
app.include_router(ingest.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Gradix Backend is running"}
