from __future__ import annotations

from .schemas import ChatbotRequest, ChatbotResponse


class ExplainabilityChatbotService:
    """Simple SHAP-driven explainability chatbot for end users."""

    def answer(self, payload: ChatbotRequest) -> ChatbotResponse:
        q = payload.question.lower()
        explanation = payload.explanation
        if "why" in q and ("rejected" in q or "declined" in q):
            if explanation.top_negative_factors:
                neg = ", ".join(explanation.top_negative_factors)
                answer = (
                    "Your application was likely rejected because the model found negative impact from: "
                    f"{neg}. These factors reduced your approval probability."
                )
            else:
                answer = (
                    "Your application was rejected based on a combination of credit score, income, "
                    "requested loan amount, and employment history."
                )
        elif "approve" in q or "approved" in q:
            pos = ", ".join(explanation.top_positive_factors) or "strong financial characteristics"
            answer = (
                "Your application was approved because the model detected positive signals from: "
                f"{pos}. These outweighed the risk factors."
            )
        elif "improve" in q or "better" in q:
            answer = (
                "To improve your approval chances, increasing your income relative to the requested "
                "loan amount and improving your credit score are the most impactful changes."
            )
        else:
            answer = (
                "This decision is based on an explainable model that weighs features like credit "
                "score, income, requested loan amount, and employment stability. "
                "Key positive factors were: "
                f"{', '.join(explanation.top_positive_factors) or 'N/A'}, "
                "while key negative factors were: "
                f"{', '.join(explanation.top_negative_factors) or 'N/A'}."
            )

        return ChatbotResponse(answer=answer)


chatbot_service = ExplainabilityChatbotService()

