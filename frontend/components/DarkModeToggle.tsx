interface Props {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function DarkModeToggle({ theme, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 hover:border-primary-500 hover:text-primary-200 transition-colors"
    >
      <span className="inline-flex h-4 w-4 rounded-full bg-gradient-to-tr from-amber-300 via-sky-400 to-emerald-300 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}

