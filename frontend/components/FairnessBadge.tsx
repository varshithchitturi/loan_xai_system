interface Props {
  fairnessFlag?: string;
}

export default function FairnessBadge({ fairnessFlag }: Props) {
  if (!fairnessFlag) return null;
  const pass = fairnessFlag === 'PASS';
  return (
    <div className="glass-card p-3 flex items-center justify-between text-xs">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Ethical AI Badge
        </div>
        <div className="text-slate-200 mt-1">
          {pass ? 'Fairness checks passed for this decision.' : 'This decision requires fairness review.'}
        </div>
      </div>
      <div
        className={
          pass
            ? 'badge-approved text-[10px] px-3 py-1'
            : 'badge-rejected text-[10px] px-3 py-1'
        }
      >
        {pass ? 'Fairness Compliant' : 'Fairness Review'}
      </div>
    </div>
  );
}

