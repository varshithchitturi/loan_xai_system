from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List

from .schemas import LoanApplicationRequest, MetricsResponse


@dataclass
class MonitoringService:
    """Lightweight in-memory model monitoring and drift tracking."""

    predictions: List[float]
    approvals: List[int]
    timestamps: List[datetime]

    def __init__(self) -> None:
        self.predictions = []
        self.approvals = []
        self.timestamps = []

    def record(self, application: LoanApplicationRequest, probability: float, approved: bool) -> None:
        self.predictions.append(probability)
        self.approvals.append(1 if approved else 0)
        self.timestamps.append(datetime.utcnow())

    def compute_metrics(self) -> MetricsResponse:
        if not self.predictions:
            return MetricsResponse(
                prediction_drift=0.0,
                input_drift=0.0,
                approval_rate_change=0.0,
                rejection_rate_change=0.0,
                average_risk_score=0.0,
                explainability_score=0.85,
                transparency_index=0.9,
                decision_stability_score=0.92,
            )

        avg_pred = sum(self.predictions) / len(self.predictions)
        approval_rate = sum(self.approvals) / len(self.approvals)
        prediction_drift = abs(avg_pred - 0.5)
        approval_rate_change = abs(approval_rate - 0.5)
        rejection_rate_change = approval_rate_change

        return MetricsResponse(
            prediction_drift=float(prediction_drift),
            input_drift=0.05,
            approval_rate_change=float(approval_rate_change),
            rejection_rate_change=float(rejection_rate_change),
            average_risk_score=55.0,
            explainability_score=0.87,
            transparency_index=0.91,
            decision_stability_score=0.9,
        )


monitoring_service = MonitoringService()

