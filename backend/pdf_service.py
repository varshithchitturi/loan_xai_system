from __future__ import annotations

import io
import os
import uuid
from typing import Tuple

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from .schemas import PDFReportRequest


REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)


class PDFReportService:
    """Generate PDF decision reports for audit and sharing."""

    def generate_report(self, payload: PDFReportRequest) -> Tuple[str, str]:
        report_id = str(uuid.uuid4())
        filename = f"loan_decision_{report_id}.pdf"
        filepath = os.path.join(REPORTS_DIR, filename)

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        y = height - 50
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, y, "Explainable AI Loan Approval Report")
        y -= 40

        p.setFont("Helvetica", 11)
        app = payload.application
        res = payload.prediction_response

        p.drawString(50, y, f"Applicant: {app.name}")
        y -= 20
        p.drawString(50, y, f"Age: {app.age} | Income: {app.income} | Loan Amount: {app.loan_amount}")
        y -= 20
        p.drawString(50, y, f"Credit Score: {app.credit_score} | Employment Years: {app.employment_years}")
        y -= 30

        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, f"Prediction: {res.prediction} (p={res.probability:.2f})")
        y -= 20
        p.drawString(50, y, f"Risk Score: {res.risk_score} / 100")
        y -= 20
        p.drawString(50, y, f"Fairness: {res.fairness_flag}")
        y -= 30

        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Explanation")
        y -= 20
        p.setFont("Helvetica", 11)
        text_obj = p.beginText(50, y)
        text_obj.textLines(res.explanations.explanation_text)
        p.drawText(text_obj)

        p.showPage()
        p.save()

        with open(filepath, "wb") as f:
            f.write(buffer.getvalue())

        download_url = f"/reports/{filename}"
        return report_id, download_url


pdf_service = PDFReportService()

