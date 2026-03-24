import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AdminAnalytics {
  stats: {
    total_applications: number;
    approval_rate: number;
    rejection_rate: number;
    average_risk_score: number;
    model_accuracy: number;
  };
  approval_distribution: { approved: number; rejected: number };
  risk_histogram: { bucket: string; count: number }[];
  feature_importance: { feature: string; importance: number }[];
  fairness_metrics: {
    demographic_parity: number;
    equal_opportunity: number;
    ethical_ai_badge: string;
  };
  prediction_drift: number;
  input_drift: number;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<AdminAnalytics | null>(null);

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

  const load = async () => {
    const t = await ensureToken();
    const res = await axios.get(`${API_BASE}/admin/analytics`, {
      headers: { Authorization: `Bearer ${t}` }
    });
    setData(res.data);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Risk & Fairness Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor portfolio health, model drift, and fairness in real time.
          </p>
        </div>
        <div className="glass-card px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-sky-300 border-sky-500/50">
          Admin / Risk Officer
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 text-xs">
        <div className="glass-card p-4 col-span-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total Apps</div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {data?.stats.total_applications ?? '—'}
          </div>
        </div>
        <div className="glass-card p-4 col-span-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Approval Rate</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-300">
            {data ? `${Math.round(data.stats.approval_rate * 100)}%` : '—'}
          </div>
        </div>
        <div className="glass-card p-4 col-span-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Rejection Rate</div>
          <div className="mt-2 text-2xl font-semibold text-red-300">
            {data ? `${Math.round(data.stats.rejection_rate * 100)}%` : '—'}
          </div>
        </div>
        <div className="glass-card p-4 col-span-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Avg Risk Score
          </div>
          <div className="mt-2 text-2xl font-semibold text-amber-300">
            {data ? Math.round(data.stats.average_risk_score) : '—'}
          </div>
        </div>
        <div className="glass-card p-4 col-span-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Model Accuracy</div>
          <div className="mt-2 text-2xl font-semibold text-sky-300">
            {data ? `${Math.round(data.stats.model_accuracy * 100)}%` : '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
            Approval Distribution
          </div>
          <div className="h-44">
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: data.approval_distribution.approved },
                      { name: 'Rejected', value: data.approval_distribution.rejected }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      fontSize: 11
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
            Risk Histogram
          </div>
          <div className="h-44">
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.risk_histogram}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      fontSize: 11
                    }}
                  />
                  <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
            Feature Importance
          </div>
          <div className="h-44">
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.feature_importance}>
                  <XAxis dataKey="feature" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      fontSize: 11
                    }}
                  />
                  <Bar dataKey="importance" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs">
        <div className="glass-card p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">
            Fairness Metrics
          </div>
          <div className="space-y-1 text-slate-200">
            <div>Demographic parity: {data?.fairness_metrics.demographic_parity ?? '—'}</div>
            <div>Equal opportunity: {data?.fairness_metrics.equal_opportunity ?? '—'}</div>
            <div className="text-emerald-300 mt-2">
              {data?.fairness_metrics.ethical_ai_badge ?? '—'}
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">
            Drift Monitors
          </div>
          <div className="space-y-1 text-slate-200">
            <div>Prediction drift: {data?.prediction_drift.toFixed(3) ?? '—'}</div>
            <div>Input drift: {data?.input_drift.toFixed(3) ?? '—'}</div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">
            Governance
          </div>
          <div className="text-slate-300">
            All decisions are logged with full audit trail, versioned model registry, and exported PDF
            justification for regulatory review.
          </div>
        </div>
      </div>
    </div>
  );
}

