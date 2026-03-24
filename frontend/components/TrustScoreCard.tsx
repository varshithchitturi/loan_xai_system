interface Props {
  trustScore?: number;
}

export default function TrustScoreCard({ trustScore }: Props) {
  const score = Math.round((trustScore ?? 0.0) * 100);
  return (
    <div className="glass-card p-4 flex flex-col">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Trust Score
        </div>
        <div className="mt-2 text-2xl font-semibold text-emerald-300">{score || '—'}</div>
        <div className="text-[11px] text-slate-500 mt-1">
          Combines model confidence, fairness, and data quality into a single indicator.
        </div>
      </div>
      <div className="mt-3 text-[10px] text-slate-500">
        Higher scores indicate more stable, transparent, and fair decisions across the portfolio.
      </div>
    </div>
  );
}

