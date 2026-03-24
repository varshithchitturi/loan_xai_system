import { useMemo } from 'react';

interface Props {
  riskScore?: number;
}

export default function RiskMeter({ riskScore }: Props) {
  const label = useMemo(() => {
    if (riskScore === undefined) return 'Awaiting score';
    if (riskScore < 30) return 'Low Risk';
    if (riskScore < 60) return 'Medium Risk';
    return 'High Risk';
  }, [riskScore]);

  const value = Math.min(Math.max(riskScore ?? 0, 0), 100);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Risk Meter</div>
        <div className="text-xs text-slate-300">{label}</div>
      </div>
      <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-amber-300 to-red-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[10px] text-slate-500">
        <span>0</span>
        <span>30</span>
        <span>60</span>
        <span>100</span>
      </div>
    </div>
  );
}

