from __future__ import annotations

from typing import Dict, List

import numpy as np
import shap
from lime.lime_tabular import LimeTabularExplainer

from .model_service import loan_model_service
from .risk_engine import risk_engine
from .schemas import ExplanationPayload, LoanApplicationRequest


class ExplainabilityService:
    """Generate SHAP/LIME-based explanations and human-readable reasons."""

    def __init__(self) -> None:
        self.lime_explainer = None

    def _get_background_data(self) -> np.ndarray:
        # In a real system, load representative training background here.
        return np.random.rand(50, 5)

    def _init_lime(self) -> None:
        if self.lime_explainer is None:
            background = self._get_background_data()
            self.lime_explainer = LimeTabularExplainer(
                background,
                feature_names=[
                    "age",
                    "income",
                    "loan_amount",
                    "credit_score",
                    "employment_years",
                ],
                class_names=["Rejected", "Approved"],
                discretize_continuous=True,
            )

    def _to_feature_vector(self, payload: LoanApplicationRequest) -> np.ndarray:
        from .model_service import loan_model_service as _svc

        return _svc._to_feature_vector(payload)

    def _compute_shap_values(
        self, payload: LoanApplicationRequest
    ) -> Dict[str, float]:
        if loan_model_service.model is None:
            # Fallback importance based on heuristic risk factors.
            importance = {
                "credit_score": 0.4,
                "income": 0.3,
                "loan_amount": -0.2,
                "employment_years": 0.1,
                "age": 0.05,
            }
            return importance

        fallback_importance = {
            "credit_score": 0.4,
            "income": 0.3,
            "loan_amount": -0.2,
            "employment_years": 0.1,
            "age": 0.05,
        }
        feature_names = [
            "age",
            "income",
            "loan_amount",
            "credit_score",
            "employment_years",
        ]
        try:
            x = self._to_feature_vector(payload).reshape(1, -1)
            explainer = shap.TreeExplainer(loan_model_service.model)
            shap_values = explainer.shap_values(x)
            if isinstance(shap_values, list):
                sv = (shap_values[1] if len(shap_values) > 1 else shap_values[0])[0]
            else:
                sv = shap_values[0]
            n = min(len(feature_names), len(sv))
            return {feature_names[i]: float(sv[i]) for i in range(n)}
        except Exception:
            return fallback_importance

    def generate_explanation(self, payload: LoanApplicationRequest) -> ExplanationPayload:
        shap_importance = self._compute_shap_values(payload)

        sorted_features = sorted(shap_importance.items(), key=lambda kv: kv[1], reverse=True)
        top_positive = [f for f, v in sorted_features if v > 0][:5]
        top_negative = [f for f, v in sorted(shap_importance.items(), key=lambda kv: kv[1]) if v < 0][
            :5
        ]

        decision_path: List[str] = []
        risk = risk_engine.compute_risk_score(payload)
        bucket = risk_engine.risk_bucket(risk)
        decision_path.append(f"Overall risk assessed as {bucket} ({risk}/100).")

        if "income" in shap_importance:
            decision_path.append(
                f"Applicant income of {payload.income:.0f} contributes "
                f"{'positively' if shap_importance['income'] >= 0 else 'negatively'}."
            )
        if "credit_score" in shap_importance:
            decision_path.append(
                f"Credit score of {payload.credit_score:.0f} is interpreted as "
                f"{'strong' if payload.credit_score > 700 else 'weak'}."
            )
        decision_path.append(
            f"Loan type '{payload.loan_type}' with tenure {payload.tenure_years} years "
            f"and {payload.existing_loans} existing loans influenced the final risk."
        )

        explanation_text = self._generate_explanation_text(
            payload, shap_importance, top_positive, top_negative
        )

        return ExplanationPayload(
            top_positive_factors=top_positive,
            top_negative_factors=top_negative,
            feature_importance=shap_importance,
            decision_path=decision_path,
            explanation_text=explanation_text,
        )

    @staticmethod
    def _generate_explanation_text(
        payload: LoanApplicationRequest,
        importance: Dict[str, float],
        top_positive: List[str],
        top_negative: List[str],
    ) -> str:
        reasons: List[str] = []
        if "income" in top_positive:
            reasons.append("income is high")
        if "credit_score" in top_positive:
            reasons.append("credit score is strong")
        if "loan_amount" in top_negative:
            reasons.append("requested loan amount is relatively high")
        if "employment_years" in top_positive:
            reasons.append("employment history is stable")

        # Loan-type specific narrative
        if payload.loan_type == "home":
            reasons.append("home loan is typically backed by collateral")
        elif payload.loan_type == "personal":
            reasons.append("unsecured personal loan carries higher inherent risk")
        elif payload.loan_type == "student":
            reasons.append("student loan risk is balanced against future income potential")
        elif payload.loan_type == "car":
            reasons.append("car loan has moderate risk with vehicle as collateral")

        if not reasons:
            return (
                "Decision is based on a balanced assessment of credit score, income, "
                "requested loan amount, and employment stability."
            )

        base = "Loan approved because " if importance.get("credit_score", 0) >= 0 else \
            "Loan rejected because "
        return base + " and ".join(reasons) + "."


explain_service = ExplainabilityService()

