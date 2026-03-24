import DarkModeToggle from './DarkModeToggle';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Layout({ children, theme, onToggleTheme }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-primary-500 via-sky-400 to-emerald-400 flex items-center justify-center text-xs font-bold tracking-wider shadow-lg shadow-primary-500/40">
              XAI
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide uppercase text-slate-200">
                Explainable AI Loan Approval
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-[0.14em]">
                Premium Fintech Risk Studio
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <Link href="/" className="hover:text-primary-300 transition-colors">
              User Studio
            </Link>
            <Link href="/admin" className="hover:text-primary-300 transition-colors">
              Admin Analytics
            </Link>
            <DarkModeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}

