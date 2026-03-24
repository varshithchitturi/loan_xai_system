from __future__ import annotations

from .schemas import LoanApplicationRequest


class RiskEngine:
    """Interpretable risk scoring engine on a 0-100 scale."""

    @staticmethod
    def compute_risk_score(application: LoanApplicationRequest) -> int:
        credit_component = (900 - application.credit_score) / 6  # 0-100
        loan_income_ratio = application.loan_amount / max(application.income, 1.0)
        ratio_component = min(loan_income_ratio * 20, 100)  # scale to 0-100
        employment_component = max(0, 50 - application.employment_years) * 2  # 0-100

        # Loan-type specific adjustment
        type_adjustment_map = {
            "personal": 6.0,
            "student": 3.0,
            "home": -4.0,
            "car": -2.0,
        }
        type_component = type_adjustment_map.get(application.loan_type, 0.0)

        # Longer tenure and many existing loans increase risk
        tenure_component = max(0, application.tenure_years - 10) * 1.5
        existing_loans_component = application.existing_loans * 3.0

        risk_score = (
            0.35 * credit_component
            + 0.25 * ratio_component
            + 0.15 * employment_component
            + 0.15 * tenure_component
            + 0.10 * existing_loans_component
            + type_component
        )
        return int(max(0, min(100, risk_score)))

    @staticmethod
    def risk_bucket(score: int) -> str:
        if score < 30:
            return "LOW RISK"
        if score < 60:
            return "MEDIUM RISK"
        return "HIGH RISK"


risk_engine = RiskEngine()

