from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="WFC Church Management Platform - Multi-Portal Backend API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware - Must be configured before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Health Check Endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Check if the API is running"""
    return {
        "status": "healthy",
        "service": "wfc-backend",
        "version": "1.0.0"
    }

# Root Endpoint
@app.get("/", tags=["Root"])
async def root():
    """API Root - Redirect to documentation"""
    return {
        "message": "WFC Church Management API",
        "docs": "/docs",
        "health": "/health"
    }
