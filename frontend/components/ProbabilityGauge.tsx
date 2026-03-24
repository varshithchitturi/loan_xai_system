import { useEffect, useState } from 'react';

interface Props {
  probability?: number;
}

export default function ProbabilityGauge({ probability }: Props) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (probability === undefined) return;
    const target = probability * 100;
    let frame: number;
    const start = animatedValue;
    const diff = target - start;
    const startTime = performance.now();

    const animate = (time: number) => {
      const t = Math.min((time - startTime) / 600, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedValue(start + diff * eased);
      if (t < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [probability]);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Approval Probability
        </div>
        <div className="text-sm font-semibold text-primary-300">
          {probability !== undefined ? `${Math.round(animatedValue)}%` : '—'}
        </div>
      </div>
      <div className="relative h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke="#020617"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * animatedValue) / 100}
          />
          <circle
            cx={10 + 80 * (animatedValue / 100)}
            cy={50 - Math.sqrt(Math.max(0, 40 * 40 - (40 * (2 * (animatedValue / 100) - 1)) ** 2))}
            r="2.2"
            fill="#e5e7eb"
          />
        </svg>
      </div>
    </div>
  );
}

