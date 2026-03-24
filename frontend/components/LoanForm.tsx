import { useState } from 'react';

export interface LoanFormValues {
  name: string;
  age: number;
  income: number;
  loan_amount: number;
  credit_score: number;
  employment_years: number;
  gender: string;
  education: string;
  marital_status: string;
  loan_type: 'personal' | 'student' | 'home' | 'car';
  tenure_years: number;
  existing_loans: number;
}

interface Props {
  onSubmit: (values: LoanFormValues) => void;
  loading: boolean;
}

const defaultValues: LoanFormValues = {
  name: '',
  age: 28,
  income: 800000,
  loan_amount: 1200000,
  credit_score: 720,
  employment_years: 4,
  gender: 'Male',
  education: 'Graduate',
  marital_status: 'Single',
  loan_type: 'personal',
  tenure_years: 10,
  existing_loans: 0
};

export default function LoanForm({ onSubmit, loading }: Props) {
  const [values, setValues] = useState<LoanFormValues>(defaultValues);

  const handleChange = (field: keyof LoanFormValues, value: string | number) => {
    setValues((prev) => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
            Loan Application
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Run a real-time explainable AI credit decision.
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-full px-3 py-1">
          Ethical AI Ready
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-300 mb-1">Full Name</label>
          <input
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Age</label>
          <input
            type="number"
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.age}
            onChange={(e) => handleChange('age', e.target.value)}
            min={18}
            max={100}
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Annual Income (₹)</label>
          <input
            type="number"
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.income}
            onChange={(e) => handleChange('income', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Loan Amount (₹)</label>
          <input
            type="number"
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.loan_amount}
            onChange={(e) => handleChange('loan_amount', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Credit Score</label>
          <input
            type="number"
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.credit_score}
            onChange={(e) => handleChange('credit_score', e.target.value)}
            min={300}
            max={900}
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Employment Years</label>
          <input
            type="number"
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.employment_years}
            onChange={(e) => handleChange('employment_years', e.target.value)}
            min={0}
            max={50}
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Gender</label>
          <select
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Education</label>
          <select
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.education}
            onChange={(e) => handleChange('education', e.target.value)}
          >
            <option>Undergraduate</option>
            <option>Graduate</option>
            <option>Postgraduate</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Marital Status</label>
          <select
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.marital_status}
            onChange={(e) => handleChange('marital_status', e.target.value)}
          >
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Loan Type</label>
          <select
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.loan_type}
            onChange={(e) =>
              handleChange('loan_type', e.target.value as LoanFormValues['loan_type'])
            }
          >
            <option value="personal">Personal Loan</option>
            <option value="student">Student Loan</option>
            <option value="home">Home Loan</option>
            <option value="car">Car Loan</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Tenure (years)</label>
          <input
            type="number"
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.tenure_years}
            onChange={(e) => handleChange('tenure_years', e.target.value)}
            min={1}
            max={40}
            required
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Existing Active Loans</label>
          <input
            type="number"
            className="w-full rounded-xl bg-slate-900/70 border border-slate-700/80 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={values.existing_loans}
            onChange={(e) => handleChange('existing_loans', e.target.value)}
            min={0}
            max={10}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 via-sky-500 to-emerald-400 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 py-2.5 shadow-lg shadow-primary-500/50 disabled:opacity-60"
      >
        {loading ? 'Scoring...' : 'Run Explainable Decision'}
      </button>
    </form>
  );
}

