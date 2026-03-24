from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class LoanApplicationRequest(BaseModel):
    name: str
    age: int = Field(..., ge=18, le=100)
    income: float = Field(..., gt=0)
    loan_amount: float = Field(..., gt=0)
    credit_score: float = Field(..., ge=300, le=900)
    employment_years: int = Field(..., ge=0, le=50)
    gender: str
    education: str
    marital_status: str
    # personal, student, home, car
    loan_type: str = Field(..., pattern="^(personal|student|home|car)$")
    tenure_years: int = Field(..., ge=1, le=40)
    existing_loans: int = Field(..., ge=0, le=10)


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    full_name: Optional[str] = None
    password: str = Field(..., min_length=6, max_length=128)
    role: str = Field(default="customer", pattern="^(admin|loan_officer|customer)$")


class RegisterResponse(BaseModel):
    username: str
    role: str


class ExplanationPayload(BaseModel):
    top_positive_factors: List[str]
    top_negative_factors: List[str]
    feature_importance: Dict[str, float]
    decision_path: List[str]
    explanation_text: str


class FairnessReport(BaseModel):
    bias_detected: bool
    demographic_parity: float
    equal_opportunity: float
    fairness_flag: str


class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    risk_score: int
    decision_reason: str
    explanations: ExplanationPayload
    fairness_flag: str
    fairness_report: FairnessReport
    model_version: str
    model_confidence: float
    trust_score: float


class SimulationRequest(BaseModel):
    base_application: LoanApplicationRequest
    new_income: Optional[float] = None
    new_credit_score: Optional[float] = None


class SimulationResponse(BaseModel):
    message: str
    new_probability: float
    new_risk_score: int
    counterfactual_income: Optional[float] = None
    counterfactual_credit_score: Optional[float] = None


class MetricsResponse(BaseModel):
    prediction_drift: float
    input_drift: float
    approval_rate_change: float
    rejection_rate_change: float
    average_risk_score: float
    explainability_score: float
    transparency_index: float
    decision_stability_score: float


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


class User(BaseModel):
    username: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    role: str


class UserInDB(User):
    hashed_password: str


class AdminDashboardStats(BaseModel):
    total_applications: int
    approval_rate: float
    rejection_rate: float
    average_risk_score: float
    model_accuracy: float


class TimeSeriesPoint(BaseModel):
    timestamp: datetime
    value: float


class ApprovalDistribution(BaseModel):
    approved: int
    rejected: int


class RiskBucket(BaseModel):
    bucket: str
    count: int


class FeatureImportancePoint(BaseModel):
    feature: str
    importance: float


class FairnessMetrics(BaseModel):
    demographic_parity: float
    equal_opportunity: float
    ethical_ai_badge: str


class AdminAnalyticsResponse(BaseModel):
    stats: AdminDashboardStats
    approval_distribution: ApprovalDistribution
    risk_histogram: List[RiskBucket]
    feature_importance: List[FeatureImportancePoint]
    fairness_metrics: FairnessMetrics
    prediction_drift: float
    input_drift: float


class ChatbotRequest(BaseModel):
    question: str
    application: LoanApplicationRequest
    explanation: ExplanationPayload


class ChatbotResponse(BaseModel):
    answer: str


class PDFReportRequest(BaseModel):
    application: LoanApplicationRequest
    prediction_response: PredictionResponse


class PDFReportResponse(BaseModel):
    report_id: str
    download_url: str

