# Entrypoint for deployment platforms (Render, Railway, etc.)
# that expect a root-level FastAPI app object.
from backend.app import app  # noqa: F401
