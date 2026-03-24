import axios from 'axios';
import { useState } from 'react';
import DecisionJustification from '@/components/DecisionJustification';
import ExplainabilityChatbot from '@/components/ExplainabilityChatbot';
import FairnessBadge from '@/components/FairnessBadge';
import FeatureImportanceChart from '@/components/FeatureImportanceChart';
import LoanForm, { LoanFormValues } from '@/components/LoanForm';
import PredictionResultCard from '@/components/PredictionResultCard';
import ProbabilityGauge from '@/components/ProbabilityGauge';
import RiskMeter from '@/components/RiskMeter';
import TrustScoreCard from '@/components/TrustScoreCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [lastForm, setLastForm] = useState<LoanFormValues | null>(null);
  const [prediction, setPrediction] = useState<any | null>(null);

  const ensureToken = async () => {
    if (token) return token;
    const stored = window.localStorage.getItem('token');
    if (!stored) {
      window.location.href = '/login';
      return '';
    }
    setToken(stored);
    return stored;
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LoanFormValues) => {
    setLoading(true);
    setLastForm(values);
    setError(null);
    try {
      const t = await ensureToken();
      if (!t) return;
      const res = await axios.post(`${API_BASE}/predict-loan`, values, {
        headers: { Authorization: `Bearer ${t}` }
      });
      setPrediction(res.data);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Prediction failed';
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (question: string): Promise<string> => {
    if (!prediction || !lastForm) return 'Run a prediction first so I have context.';
    const t = await ensureToken();
    const res = await axios.post(
      `${API_BASE}/chat/explainability`,
      {
        question,
        application: lastForm,
        explanation: prediction.explanations
      },
      { headers: { Authorization: `Bearer ${t}` } }
    );
    return res.data.answer;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Explainable Credit Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate AI-powered loan approvals with full transparency and fairness monitoring.
          </p>
        </div>
        <div className="glass-card px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-emerald-300 border-emerald-500/50">
          Premium Fintech UI
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/40 text-red-300 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 items-start">
        <LoanForm onSubmit={handleSubmit} loading={loading} />
        <div className="space-y-4 min-w-0">
          <PredictionResultCard
            prediction={prediction?.prediction}
            probability={prediction?.probability}
            riskScore={prediction?.risk_score}
            explanationText={prediction?.decision_reason}
            fairnessFlag={prediction?.fairness_flag}
            trustScore={prediction?.trust_score}
          />
          <DecisionJustification
            prediction={prediction?.prediction}
            explanations={prediction?.explanations}
          />
          <div className="grid grid-cols-2 gap-3">
            <ProbabilityGauge probability={prediction?.probability} />
            <RiskMeter riskScore={prediction?.risk_score} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 items-start">
        <FeatureImportanceChart featureImportance={prediction?.explanations?.feature_importance} />
        <ExplainabilityChatbot onAsk={handleAsk} />
        <div className="space-y-3 min-w-0">
          <FairnessBadge fairnessFlag={prediction?.fairness_flag} />
          <TrustScoreCard trustScore={prediction?.trust_score} />
        </div>
      </div>
    </div>
  );
}

