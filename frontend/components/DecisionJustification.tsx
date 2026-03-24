interface ExplanationData {
  explanation_text?: string;
  decision_path?: string[];
  top_positive_factors?: string[];
  top_negative_factors?: string[];
  feature_importance?: Record<string, number>;
}

interface Props {
  prediction?: string;
  explanations?: ExplanationData | null;
}

export default function DecisionJustification({ prediction, explanations }: Props) {
  if (!prediction || !explanations) {
    return null;
  }

  const text = explanations.explanation_text;
  const path = explanations.decision_path || [];
  const positive = explanations.top_positive_factors || [];
  const negative = explanations.top_negative_factors || [];

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-300 text-sm font-bold">
          ?
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            Why this decision?
          </h3>
          <p className="text-[11px] text-slate-400">
            Automatic justification from the explainable AI model
          </p>
        </div>
      </div>

      {text && (
        <div className="rounded-xl bg-slate-900/70 border border-slate-700/80 p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-2">
            Summary
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {text}
          </p>
        </div>
      )}

      {path.length > 0 && (
        <div className="rounded-xl bg-slate-900/70 border border-slate-700/80 p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-2">
            Decision path
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {path.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary-400 shrink-0">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {positive.length > 0 && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 mb-2">
              Factors in your favour
            </div>
            <ul className="space-y-1 text-xs text-slate-200">
              {positive.map((f, i) => (
                <li key={i}>+ {f.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </div>
        )}
        {negative.length > 0 && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-amber-400 mb-2">
              Factors that reduced approval
            </div>
            <ul className="space-y-1 text-xs text-slate-200">
              {negative.map((f, i) => (
                <li key={i}>− {f.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
