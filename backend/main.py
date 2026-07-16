from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.dashboard import router as dashboard_router

app = FastAPI(title="Redhelp API", version="1.0.0")

# Allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Redhelp API"}
