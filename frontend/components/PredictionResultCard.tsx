import classNames from 'classnames';

interface Props {
  prediction?: string;
  probability?: number;
  riskScore?: number;
  explanationText?: string;
  fairnessFlag?: string;
  trustScore?: number;
}

export default function PredictionResultCard({
  prediction,
  probability,
  riskScore,
  explanationText,
  fairnessFlag,
  trustScore
}: Props) {
  if (!prediction) {
    return (
      <div className="glass-card p-6 flex items-center justify-center text-xs text-slate-400 min-h-[140px]">
        Insights will appear here once you run a decision.
      </div>
    );
  }

  const approved = prediction === 'Approved';

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            Decision Outcome
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={classNames('text-lg font-semibold', {
                'text-emerald-400': approved,
                'text-red-400': !approved
              })}
            >
              {prediction}
            </span>
            <span className={approved ? 'badge-approved' : 'badge-rejected'}>
              {approved ? 'Approved' : 'Rejected'}
            </span>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-400">
          <div>Model Confidence</div>
          <div className="text-sm text-slate-200 font-semibold">
            {(trustScore ?? 0) * 100 > 0 ? `${Math.round((trustScore ?? 0) * 100)}%` : '—'}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="glass-card bg-slate-900/60 border-slate-800/80 p-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Approval Prob.</div>
          <div className="mt-1 text-lg font-semibold text-primary-300">
            {probability !== undefined ? `${Math.round(probability * 100)}%` : '—'}
          </div>
        </div>
        <div className="glass-card bg-slate-900/60 border-slate-800/80 p-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Risk Score</div>
          <div className="mt-1 text-lg font-semibold text-amber-300">
            {riskScore !== undefined ? `${riskScore}/100` : '—'}
          </div>
        </div>
        <div className="glass-card bg-slate-900/60 border-slate-800/80 p-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Fairness</div>
          <div className="mt-1 text-xs font-semibold text-emerald-400">{fairnessFlag}</div>
        </div>
      </div>
      <div className="text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-slate-200">Automatic justification: </span>
        {explanationText || 'See “Why this decision?” below for the full explanation.'}
      </div>
    </div>
  );
}

