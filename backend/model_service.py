from __future__ import annotations

import os
from typing import Tuple

import joblib
import numpy as np
import pandas as pd

from .config import get_settings
from .schemas import LoanApplicationRequest


settings = get_settings()


class LoanModelService:
    """
    Service responsible for loading and serving the loan approval model.

    Priority:
    1. Use research pipeline bundle from `untitled80.py` (best_model_bundle.pkl)
    2. Fallback to simple joblib model + scaler if provided.
    3. Final fallback is a heuristic score.
    """

    def __init__(self) -> None:
        self.model = None
        self.scaler = None
        self.model_version = "1.0.0"
        self.feature_names: list[str] = []
        self._load_artifacts()

    def _load_artifacts(self) -> None:
        # 1) Try to load research pipeline bundle
        if os.path.exists(settings.model_bundle_path):
            bundle = joblib.load(settings.model_bundle_path)
            self.model = bundle.get("best_model")
            self.scaler = bundle.get("scaler")
            self.feature_names = bundle.get("features", [])
            self.model_version = "research-bundle-1.0"
            return

        # 2) Fallback to plain model + scaler, if provided
        if os.path.exists(settings.model_path):
            self.model = joblib.load(settings.model_path)
        else:
            self.model = None

        if os.path.exists(settings.scaler_path):
            self.scaler = joblib.load(settings.scaler_path)
        else:
            self.scaler = None

    def _to_feature_vector(self, payload: LoanApplicationRequest) -> np.ndarray:
        """
        Map API payload into the feature space expected by the underlying model.

        If a research bundle is available, we build a full feature row that
        matches `feature_names`, filling unknown columns with neutral defaults.
        Otherwise we fall back to a compact engineered vector.
        """
        if self.feature_names:
            # Start with zeros and then map the fields we know.
            row = {name: 0.0 for name in self.feature_names}

            # Direct name matches
            if "age" in row:
                row["age"] = float(payload.age)
            if "income" in row:
                row["income"] = float(payload.income)
            if "loan_amount" in row:
                row["loan_amount"] = float(payload.loan_amount)
            if "credit_score" in row:
                row["credit_score"] = float(payload.credit_score)
            if "employment_years" in row:
                row["employment_years"] = float(payload.employment_years)

            # Common loan dataset aliases
            if "ApplicantIncome" in row:
                row["ApplicantIncome"] = float(payload.income)
            if "LoanAmount" in row:
                row["LoanAmount"] = float(payload.loan_amount)
            if "Credit_History" in row:
                # Map credit_score 300–900 to simple 0/1 credit history proxy
                row["Credit_History"] = 1.0 if payload.credit_score >= 650 else 0.0

            if "Gender" in row:
                row["Gender"] = 1.0 if payload.gender.lower().startswith("m") else 0.0
            if "Married" in row:
                row["Married"] = 1.0 if payload.marital_status.lower().startswith("m") else 0.0
            if "Education" in row:
                row["Education"] = 1.0 if "grad" in payload.education.lower() else 0.0

            df = pd.DataFrame([row])
            numerical = df[self.feature_names].values.astype(float)[0]
            if self.scaler is not None:
                numerical = self.scaler.transform([numerical])[0]
            return numerical

        # Compact engineered feature vector fallback
        numerical = np.array(
            [
                payload.age,
                payload.income,
                payload.loan_amount,
                payload.credit_score,
                payload.employment_years,
            ],
            dtype=float,
        )
        if self.scaler is not None:
            numerical = self.scaler.transform([numerical])[0]
        return numerical

    def predict(self, payload: LoanApplicationRequest) -> Tuple[str, float, float]:
        """Return prediction label, probability, and model confidence."""
        features = self._to_feature_vector(payload).reshape(1, -1)
        if self.model is None:
            # Fallback simple heuristic if model is not present.
            score = (
                0.4 * (payload.credit_score / 900)
                + 0.3 * (payload.income / max(payload.loan_amount, 1.0))
                + 0.3 * (payload.employment_years / 30.0)
            )
            probability = float(min(max(score, 0.0), 1.0))
            label = "Approved" if probability >= 0.5 else "Rejected"
            confidence = abs(probability - 0.5) * 2
            return label, probability, confidence

        proba = self.model.predict_proba(features)[0][1]
        label = "Approved" if proba >= 0.5 else "Rejected"
        confidence = float(abs(proba - 0.5) * 2)
        return label, float(proba), confidence


loan_model_service = LoanModelService()

