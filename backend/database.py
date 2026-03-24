from __future__ import annotations

import os
from datetime import datetime
from typing import Generator

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.ext.declarative import declarative_base  # type: ignore[deprecated]
from sqlalchemy.orm import relationship, sessionmaker, Session

from .config import get_settings


settings = get_settings()

# Use DATABASE_URL if provided, otherwise default to a local SQLite db so the
# system runs out-of-the-box without a PostgreSQL server.
DEFAULT_SQLITE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "loan_xai.db",
)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DEFAULT_SQLITE_PATH}",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    income = Column(Float, nullable=False)
    loan_amount = Column(Float, nullable=False)
    credit_score = Column(Float, nullable=False)
    employment_years = Column(Integer, nullable=False)
    loan_type = Column(String(32), nullable=False, default="personal")
    tenure_years = Column(Integer, nullable=False, default=5)
    existing_loans = Column(Integer, nullable=False, default=0)
    gender = Column(String(32), nullable=False)
    education = Column(String(64), nullable=False)
    marital_status = Column(String(32), nullable=False)
    prediction = Column(String(32), nullable=False)
    probability = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    decisions = relationship("Decision", back_populates="applicant")


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicants.id"), nullable=False)
    model_version = Column(String(64), nullable=False)
    decision = Column(String(32), nullable=False)
    explanation = Column(Text, nullable=False)
    fairness_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    applicant = relationship("Applicant", back_populates="decisions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor = Column(String(255), nullable=False)
    role = Column(String(64), nullable=False)
    action = Column(String(255), nullable=False)
    prediction_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(64), nullable=False, unique=True)
    accuracy = Column(Float, nullable=False)
    date_deployed = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(Text, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(64), nullable=False)
    disabled = Column(Integer, default=0, nullable=False)


def _migrate_sqlite_add_applicant_columns() -> None:
    """Add loan_type, tenure_years, existing_loans to applicants if using SQLite and columns missing."""
    if "sqlite" not in DATABASE_URL:
        return
    from sqlalchemy import text

    with engine.connect() as conn:
        try:
            r = conn.execute(text("PRAGMA table_info(applicants)"))
            cols = [row[1] for row in r.fetchall()]
        except Exception:
            return
        for col, sql in [
            ("loan_type", "ALTER TABLE applicants ADD COLUMN loan_type VARCHAR(32) NOT NULL DEFAULT 'personal'"),
            ("tenure_years", "ALTER TABLE applicants ADD COLUMN tenure_years INTEGER NOT NULL DEFAULT 5"),
            ("existing_loans", "ALTER TABLE applicants ADD COLUMN existing_loans INTEGER NOT NULL DEFAULT 0"),
        ]:
            if col not in cols:
                try:
                    conn.execute(text(sql))
                    conn.commit()
                except Exception:
                    conn.rollback()


def init_db() -> None:
    """Create database tables. In production, prefer Alembic migrations."""
    Base.metadata.create_all(bind=engine)
    _migrate_sqlite_add_applicant_columns()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency providing a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

