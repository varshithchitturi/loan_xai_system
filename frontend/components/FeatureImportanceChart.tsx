import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  featureImportance?: Record<string, number>;
}

export default function FeatureImportanceChart({ featureImportance }: Props) {
  const data =
    featureImportance &&
    Object.entries(featureImportance).map(([feature, value]) => ({
      feature,
      value
    }));

  return (
    <div className="glass-card p-4 min-h-[220px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          SHAP Feature Importance
        </div>
        <div className="text-[10px] text-slate-500">Local explanation</div>
      </div>
      <div className="h-48">
        {data ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="feature" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #1f2937',
                  fontSize: 11
                }}
              />
              <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            Run a decision to view per-feature impact.
          </div>
        )}
      </div>
    </div>
  );
}

