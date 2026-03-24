from __future__ import annotations

import os
from functools import lru_cache
from pydantic import BaseModel


class Settings(BaseModel):
    """Application configuration loaded from environment variables."""

    app_name: str = "Explainable AI Loan Approval Platform"
    environment: str = os.getenv("ENVIRONMENT", "local")
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"

    # Database
    postgres_user: str = os.getenv("POSTGRES_USER", "loan_user")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "loan_password")
    postgres_db: str = os.getenv("POSTGRES_DB", "loan_xai_db")
    postgres_host: str = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port: str = os.getenv("POSTGRES_PORT", "5432")

    # JWT / Auth
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_SECRET")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 8

    # Model configuration (research pipeline integration + fallback joblib)
    model_bundle_path: str = os.getenv(
        "MODEL_BUNDLE_PATH",
        os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "models",
            "best_model_bundle.pkl",
        ),
    )
    model_path: str = os.getenv(
        "MODEL_PATH",
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "best_model.pkl"),
    )
    scaler_path: str = os.getenv(
        "SCALER_PATH",
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "scaler.pkl"),
    )

    # Caching
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()

