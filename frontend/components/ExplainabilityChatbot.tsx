import { useState } from 'react';

interface Props {
  onAsk: (question: string) => Promise<string>;
}

export default function ExplainabilityChatbot({ onAsk }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const a = await onAsk(question);
    setAnswer(a);
    setLoading(false);
  };

  return (
    <div className="glass-card p-4 flex flex-col min-h-[200px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            XAI Copilot
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ask why the model decided this way.
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-full px-2 py-1">
          Explainable
        </div>
      </div>
      <form onSubmit={handleAsk} className="space-y-2">
        <input
          className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder='e.g. "Why was I rejected?"'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 px-3 py-1.5 hover:border-primary-500 hover:text-primary-200 transition-colors disabled:opacity-60"
        >
          {loading ? 'Thinking...' : 'Ask Model'}
        </button>
      </form>
      <div className="mt-3 text-xs text-slate-300 flex-1 overflow-auto">
        {answer ? (
          <p>{answer}</p>
        ) : (
          <p className="text-slate-500">The copilot will respond here using SHAP context.</p>
        )}
      </div>
    </div>
  );
}

