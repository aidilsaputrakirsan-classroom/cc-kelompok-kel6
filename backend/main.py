from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cloud App API",
    description="API untuk mata kuliah Komputasi Awan",
    version="0.1.0"
)

# CORS - agar frontend bisa akses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Untuk development saja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Hello from Cloud App API!",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/team")
def team_info():
    return {
        "team": "cloud-team-XX",
        "members": [
            {"name": "Achmad Bayhaqi", "nim": "10231001", "role": "Lead Backend"},
            {"name": "INDAH NUR FORTUNA", "nim": "10231044", "role": "Lead Frontend"},
            {"name": "Alfiani Dwiyuniarti", "nim": "10231010", "role": "Lead Container"},
            {"name": "ZAHWA HANNA DWI PUTRI", "nim": "10231092", "role": "Lead CI/CD & Deploy"},
            {"name": "Nilam Ayu NandaStari Romdoni", "nim": "10231070", "role": "Lead QA & Docs"},
        ]
    }
