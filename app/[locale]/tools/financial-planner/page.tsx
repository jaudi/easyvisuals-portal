"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";

const fmt = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });

const STEPS = [
  { num: 1, label: "Budget", icon: "💰", desc: "Monthly income & spending" },
  { num: 2, label: "Debt", icon: "💳", desc: "Outstanding balances" },
  { num: 3, label: "Compounding", icon: "📈", desc: "Grow your savings" },
  { num: 4, label: "Allocation", icon: "🎯", desc: "Invest your wealth" },
];

const EXPENSE_CATS = [
  { key: "housing",       label: "Housing",       color: "#3b82f6", default: 1200 },
  { key: "transport",     label: "Transport",     color: "#8b5cf6", default: 300  },
  { key: "food",          label: "Food & Dining", color: "#f59e0b", default: 400  },
  { key: "utilities",     label: "Utilities",     color: "#22c55e", default: 200  },
  { key: "health",        label: "Health",        color: "#ec4899", default: 100  },
  { key: "entertainment", label: "Entertainment", color: "#14b8a6", default: 150  },
  { key: "other",         label: "Other",         color: "#9ca3af", default: 150  },
];

const DEBT_ITEMS = [
  { key: "mortgage",     label: "Mortgage",      rate: 4.5,  term: 25, color: "#3b82f6" },
  { key: "car",          label: "Car Loan",       rate: 7.0,  term: 5,  color: "#8b5cf6" },
  { key: "credit_card",  label: "Credit Card",   rate: 22.0, term: 3,  color: "#ef4444" },
  { key: "student",      label: "Student Loan",  rate: 5.0,  term: 10, color: "#f59e0b" },
  { key: "personal",     label: "Personal Loan", rate: 12.0, term: 5,  color: "#ec4899" },
];

const RATE_PRESETS = [
  { label: "S&P 500", rate: 10 },
  { label: "Global",  rate: 8  },
  { label: "Bonds",   rate: 4  },
  { label: "Custom",  rate: null },
];

const RISK_PROFILES = {
  conservative: { label: "Conservative", stocks: 30, bonds: 50, cash: 15, alternatives: 5  },
  moderate:     { label: "Moderate",     stocks: 60, bonds: 30, cash:  7, alternatives: 3  },
  aggressive:   { label: "Aggressive",   stocks: 85, bonds: 10, cash:  3, alternatives: 2  },
};

const ALLOC_COLORS: Record<string, string> = {
  Stocks: "#3b82f6", Bonds: "#22c55e", Cash: "#f59e0b", Alternatives: "#8b5cf6",
};

function NumInput({ label, value, onChange, prefix = "£", step = 100, note }: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; step?: number; note?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="flex items-center bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 focus-within:border-blue-500 transition">
        {prefix && <span className="text-gray-500 text-sm mr-1.5 shrink-0">{prefix}</span>}
        <input
          type="number" min={0} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="bg-transparent text-white text-sm w-full outline-none"
        />
      </div>
      {note && <p className="text-xs text-gray-600">{note}</p>}
    </div>
  );
}

function KpiCard({ label, value, sub, colorClass }: { label: string; value: string; sub: string; colorClass: string }) {
  return (
    <div className={`bg-[#0d1426] border border-gray-800 border-l-4 ${colorClass} rounded-xl p-4`}>
      <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{label}</div>
      <div className="text-2xl font-extrabold text-white leading-tight">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}

export default function FinancialPlannerPage() {
  const [step, setStep] = useState(1);

  // Step 1 — Budget
  const [income, setIncome] = useState(4000);
  const [expenses, setExpenses] = useState<Record<string, number>>(
    Object.fromEntries(EXPENSE_CATS.map(c => [c.key, c.default]))
  );

  // Step 2 — Debt
  const [debts, setDebts] = useState<Record<string, number>>({
    mortgage: 200000, car: 15000, credit_card: 3000, student: 0, personal: 0,
  });

  // Step 3 — Compounding
  const [years, setYears] = useState(20);
  const [ratePreset, setRatePreset] = useState(1);
  const [customRate, setCustomRate] = useState(8);

  // Step 4 — Allocation
  const [age, setAge] = useState(35);
  const [risk, setRisk] = useState<"conservative" | "moderate" | "aggressive">("moderate");

  // ── Step 1 calculations ──────────────────────────────────────────────────
  const totalExpenses = useMemo(() => Object.values(expenses).reduce((a, b) => a + b, 0), [expenses]);
  const netSavings = income - totalExpenses;
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

  const budgetDonutData = EXPENSE_CATS
    .filter(c => expenses[c.key] > 0)
    .map(c => ({ name: c.label, value: expenses[c.key], color: c.color }));

  // ── Step 2 calculations ──────────────────────────────────────────────────
  const totalDebt = useMemo(() => Object.values(debts).reduce((a, b) => a + b, 0), [debts]);
  const totalInterestCost = useMemo(() =>
    DEBT_ITEMS.reduce((sum, d) => {
      const bal = debts[d.key] ?? 0;
      if (bal === 0) return sum;
      return sum + bal * (d.rate / 100) * (d.term / 2);
    }, 0),
  [debts]);

  const debtBarData = DEBT_ITEMS
    .filter(d => (debts[d.key] ?? 0) > 0)
    .map(d => ({
      name: d.label,
      Balance: debts[d.key],
      "Est. Interest": Math.round(debts[d.key] * (d.rate / 100) * (d.term / 2)),
      color: d.color,
    }));

  const highestRateDebt = DEBT_ITEMS
    .filter(d => debts[d.key] > 0)
    .sort((a, b) => b.rate - a.rate)[0];

  // ── Step 3 calculations ──────────────────────────────────────────────────
  const annualRate = RATE_PRESETS[ratePreset].rate ?? customRate;
  const monthlyContrib = Math.max(0, netSavings);

  const { compoundData, finalValue, finalInterest } = useMemo(() => {
    const r = annualRate / 100 / 12;
    let balance = 0;
    let totalContrib = 0;
    let totalInt = 0;
    const rows: { year: number; "Contributions": number; "Interest Earned": number }[] = [];
    for (let m = 1; m <= years * 12; m++) {
      const interest = balance * r;
      balance = balance + interest + monthlyContrib;
      totalInt += interest;
      totalContrib += monthlyContrib;
      if (m % 12 === 0) {
        rows.push({ year: m / 12, "Contributions": Math.round(totalContrib), "Interest Earned": Math.round(totalInt) });
      }
    }
    const last = rows[rows.length - 1];
    return {
      compoundData: rows,
      finalValue: last ? last["Contributions"] + last["Interest Earned"] : 0,
      finalInterest: last ? last["Interest Earned"] : 0,
    };
  }, [annualRate, monthlyContrib, years]);

  // ── Step 4 calculations ──────────────────────────────────────────────────
  const profile = RISK_PROFILES[risk];
  const ageAdj = Math.max(0, Math.min(20, age - 30)) * 0.5;
  const allocData = [
    { name: "Stocks",       value: Math.round(Math.max(10, profile.stocks - ageAdj)) },
    { name: "Bonds",        value: Math.round(Math.min(70, profile.bonds + ageAdj * 0.7)) },
    { name: "Cash",         value: profile.cash },
    { name: "Alternatives", value: profile.alternatives },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Fixed header with stepper */}
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-[#0d1426]/95 backdrop-blur border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/tools" className="text-gray-400 hover:text-white text-sm transition">← Tools</Link>
            <span className="text-gray-700 hidden md:block">|</span>
            <span className="text-white font-bold text-sm hidden md:block">🗺️ Financial Journey</span>
          </div>
          {/* Step pills */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1">
                <button
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    step === s.num
                      ? "bg-blue-600 text-white"
                      : step > s.num
                      ? "bg-green-600/20 text-green-400 border border-green-600/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="hidden sm:block">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span className="text-gray-700 text-xs">›</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-7xl mx-auto mt-2">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-[140px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── STEP 1: Budget ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="lg:w-72 xl:w-80 shrink-0">
                <div className="lg:sticky lg:top-[140px] flex flex-col gap-4">
                  <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-3">Monthly Income</h3>
                    <NumInput label="Take-home pay" value={income} onChange={setIncome} step={200} />
                  </div>
                  <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3">Monthly Expenses</h3>
                    <div className="flex flex-col gap-2.5">
                      {EXPENSE_CATS.map(cat => (
                        <NumInput
                          key={cat.key}
                          label={cat.label}
                          value={expenses[cat.key]}
                          onChange={v => setExpenses(p => ({ ...p, [cat.key]: v }))}
                          step={50}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1 min-w-0 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3">
                  <KpiCard label="Monthly Income" value={`£${fmt(income)}`} sub="Take-home pay" colorClass="border-l-green-500" />
                  <KpiCard label="Monthly Expenses" value={`£${fmt(totalExpenses)}`} sub="All categories" colorClass="border-l-red-500" />
                  <KpiCard
                    label="Net Savings"
                    value={`£${fmt(Math.abs(netSavings))}`}
                    sub={`${savingsRate.toFixed(1)}% savings rate`}
                    colorClass={netSavings >= 0 ? "border-l-blue-500" : "border-l-red-500"}
                  />
                </div>

                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                  <h2 className="text-white font-bold mb-1">Where Your Money Goes</h2>
                  <p className="text-gray-500 text-xs mb-4">Monthly spending breakdown</p>
                  {budgetDonutData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={360}>
                      <PieChart>
                        <Pie
                          data={budgetDonutData}
                          cx="50%" cy="50%"
                          innerRadius={90} outerRadius={140}
                          paddingAngle={2} dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={{ stroke: "#374151" }}
                        >
                          {budgetDonutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 12 }}
                          formatter={(v: unknown) => [`£${fmt(Number(v))}`, undefined]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[360px] flex items-center justify-center text-gray-500">Enter expenses to see breakdown</div>
                  )}
                </div>

                {netSavings < 0 && (
                  <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 text-sm text-red-300">
                    ⚠️ Your expenses exceed your income by <strong>£{fmt(Math.abs(netSavings))}/mo</strong>. Consider reducing spending before investing.
                  </div>
                )}
                {netSavings > 0 && savingsRate >= 20 && (
                  <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 text-sm text-green-300">
                    ✅ Savings rate of <strong>{savingsRate.toFixed(1)}%</strong> — above the recommended 20% target. Great position to build wealth.
                  </div>
                )}

                <div className="flex justify-end">
                  <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition">
                    Next: Calculate Debt →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Debt ───────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="lg:w-72 xl:w-80 shrink-0">
                <div className="lg:sticky lg:top-[140px] flex flex-col gap-4">
                  <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3">Outstanding Balances</h3>
                    <div className="flex flex-col gap-3">
                      {DEBT_ITEMS.map(d => (
                        <div key={d.key} className="flex flex-col gap-1">
                          <label className="text-xs text-gray-400">
                            {d.label}
                            <span className="text-gray-600 ml-1">({d.rate}% APR · {d.term}yr)</span>
                          </label>
                          <div className="flex items-center bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 focus-within:border-blue-500 transition">
                            <span className="text-gray-500 text-sm mr-1.5 shrink-0">£</span>
                            <input
                              type="number" min={0} step={1000}
                              value={debts[d.key] ?? 0}
                              onChange={e => setDebts(p => ({ ...p, [d.key]: parseFloat(e.target.value) || 0 }))}
                              className="bg-transparent text-white text-sm w-full outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1 min-w-0 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-3">
                  <KpiCard label="Total Debt" value={`£${fmt(totalDebt)}`} sub="All balances combined" colorClass="border-l-red-500" />
                  <KpiCard label="Est. Total Interest" value={`£${fmt(totalInterestCost)}`} sub="Over full repayment term" colorClass="border-l-orange-500" />
                </div>

                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                  <h2 className="text-white font-bold mb-1">Debt Breakdown</h2>
                  <p className="text-gray-500 text-xs mb-4">Balance vs estimated interest cost — sorted by size</p>
                  {debtBarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={debtBarData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis
                          type="number" stroke="#374151"
                          tick={{ fill: "#6b7280", fontSize: 11 }}
                          tickFormatter={v => `£${(v / 1000).toFixed(0)}k`}
                        />
                        <YAxis type="category" dataKey="name" stroke="#374151" tick={{ fill: "#9ca3af", fontSize: 11 }} width={95} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 12 }}
                          formatter={(v: unknown) => [`£${fmt(Number(v))}`, undefined]}
                        />
                        <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12, paddingTop: 8 }} />
                        <Bar dataKey="Balance" fill="#3b82f6" stackId="a" />
                        <Bar dataKey="Est. Interest" fill="#ef4444" stackId="a" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-green-400 font-semibold">
                      🎉 No debts — you&apos;re debt free!
                    </div>
                  )}
                </div>

                {highestRateDebt && (
                  <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4 text-sm text-amber-300">
                    <span className="font-bold">💡 Debt Avalanche tip:</span> Your highest-rate debt is{" "}
                    <strong>{highestRateDebt.label}</strong> at {highestRateDebt.rate}% APR.
                    Paying this off first minimises total interest paid.
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white text-sm transition">← Back</button>
                  <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition">
                    Next: Grow Your Savings →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Compounding ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="lg:w-72 xl:w-80 shrink-0">
                <div className="lg:sticky lg:top-[140px] flex flex-col gap-4">
                  <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Your Savings</h3>
                    <div className="bg-[#111827] border border-gray-700 rounded-lg p-3 mb-3">
                      <div className="text-xs text-gray-400 mb-1">Monthly savings (from Step 1)</div>
                      <div className={`text-2xl font-extrabold ${netSavings >= 0 ? "text-green-400" : "text-red-400"}`}>
                        £{fmt(Math.max(0, netSavings))}<span className="text-sm font-normal text-gray-400">/mo</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400">Investment horizon</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range" min={1} max={40} value={years}
                          onChange={e => setYears(parseInt(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                        <span className="text-white font-bold text-sm shrink-0 w-12">{years}yr</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Expected Return</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {RATE_PRESETS.map((p, i) => (
                        <button
                          key={p.label}
                          onClick={() => setRatePreset(i)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${ratePreset === i ? "bg-blue-600 text-white" : "bg-[#111827] text-gray-400 border border-gray-700 hover:text-white"}`}
                        >
                          {p.label}{p.rate !== null ? ` ${p.rate}%` : ""}
                        </button>
                      ))}
                    </div>
                    {RATE_PRESETS[ratePreset].rate === null && (
                      <NumInput label="Custom rate %" value={customRate} onChange={setCustomRate} prefix="%" step={0.5} />
                    )}
                    <div className="mt-3 bg-[#111827] rounded-lg p-3 text-xs text-gray-500">
                      <div>🇺🇸 S&P 500 (1928–2024): ~10%/yr</div>
                      <div>🌍 MSCI World: ~8%/yr</div>
                      <div className="text-gray-600 mt-1">Past performance ≠ future results</div>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1 min-w-0 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3">
                  <KpiCard label="Monthly Contribution" value={`£${fmt(monthlyContrib)}`} sub="From your budget surplus" colorClass="border-l-blue-500" />
                  <KpiCard label={`Value after ${years} years`} value={`£${fmt(finalValue)}`} sub={`At ${annualRate}% annual return`} colorClass="border-l-green-500" />
                  <KpiCard label="Interest Earned" value={`£${fmt(finalInterest)}`} sub={`${finalValue > 0 ? ((finalInterest / finalValue) * 100).toFixed(0) : 0}% of final value`} colorClass="border-l-yellow-400" />
                </div>

                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                  <h2 className="text-white font-bold mb-1">Compound Growth Over {years} Years</h2>
                  <p className="text-gray-500 text-xs mb-4">
                    Monthly contributions of <strong className="text-white">£{fmt(monthlyContrib)}</strong> at <strong className="text-white">{annualRate}%</strong> annual return
                  </p>
                  <ResponsiveContainer width="100%" height={340}>
                    <AreaChart data={compoundData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="year" stroke="#374151"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        label={{ value: "Year", position: "insideBottom", offset: -10, fill: "#6b7280", fontSize: 11 }}
                      />
                      <YAxis
                        stroke="#374151" tick={{ fill: "#6b7280", fontSize: 11 }} width={75}
                        tickFormatter={v => v >= 1000000 ? `£${(v / 1000000).toFixed(1)}M` : `£${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 12 }}
                        formatter={(v: unknown) => [`£${fmt(Number(v))}`, undefined]}
                      />
                      <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12, paddingTop: 16 }} />
                      <Area type="monotone" dataKey="Contributions" stackId="1" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.75} />
                      <Area type="monotone" dataKey="Interest Earned" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.75} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white text-sm transition">← Back</button>
                  <button onClick={() => setStep(4)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition">
                    Next: Asset Allocation →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Allocation ─────────────────────────────────────────── */}
          {step === 4 && (
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="lg:w-72 xl:w-80 shrink-0">
                <div className="lg:sticky lg:top-[140px] flex flex-col gap-4">
                  <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Your Profile</h3>
                    <div className="flex flex-col gap-4">
                      <NumInput label="Your Age" value={age} onChange={setAge} prefix="" step={1} />
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Risk Tolerance</label>
                        <div className="flex flex-col gap-2">
                          {(Object.entries(RISK_PROFILES) as [typeof risk, typeof RISK_PROFILES[typeof risk]][]).map(([key, p]) => (
                            <button
                              key={key}
                              onClick={() => setRisk(key)}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition border ${risk === key ? "bg-blue-600/20 border-blue-500 text-white" : "bg-[#111827] border-gray-700 text-gray-400 hover:text-white"}`}
                            >
                              <span>{p.label}</span>
                              <span className="text-xs text-gray-400">{p.stocks}% stocks</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Explore With Our Tools</h3>
                    <p className="text-xs text-gray-500 mb-3">Analyse real stocks & your portfolio</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "📊 Portfolio Analysis", href: "/tools/portfolio-analysis" },
                        { label: "📉 Stock Comparison",   href: "/tools/stock-comparison"   },
                        { label: "📈 Stock Analysis",     href: "/tools/stock-analysis"     },
                      ].map(t => (
                        <Link
                          key={t.href}
                          href={t.href}
                          target="_blank"
                          className="block bg-[#111827] border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white text-sm px-4 py-2.5 rounded-lg transition"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1 min-w-0 flex flex-col gap-6">
                {/* Allocation KPIs */}
                <div className="grid grid-cols-4 gap-3">
                  {allocData.map(a => (
                    <div key={a.name} className="bg-[#0d1426] border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: ALLOC_COLORS[a.name], borderLeftWidth: 4 }}>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{a.name}</div>
                      <div className="text-2xl font-extrabold text-white">{a.value}%</div>
                    </div>
                  ))}
                </div>

                {/* Allocation donut */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                  <h2 className="text-white font-bold mb-1">Recommended Asset Allocation</h2>
                  <p className="text-gray-500 text-xs mb-4">
                    {profile.label} profile · Age {age} · adjusted for time horizon
                  </p>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={allocData}
                        cx="50%" cy="50%"
                        innerRadius={90} outerRadius={130}
                        paddingAngle={3} dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                        labelLine={{ stroke: "#374151" }}
                      >
                        {allocData.map((entry, i) => <Cell key={i} fill={ALLOC_COLORS[entry.name]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 12 }}
                        formatter={(v: unknown) => [`${Number(v)}%`, undefined]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Final journey summary */}
                <div className="bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-[#0d1426] border border-blue-700/30 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-lg mb-5">Your Financial Journey Summary</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {[
                      { icon: "💰", label: "Monthly Surplus", value: `£${fmt(Math.max(0, netSavings))}`, sub: `${savingsRate.toFixed(1)}% savings rate`, color: netSavings >= 0 ? "text-green-400" : "text-red-400" },
                      { icon: "💳", label: "Total Debt",      value: `£${fmt(totalDebt)}`,               sub: `£${fmt(totalInterestCost)} est. interest`,   color: "text-red-400"   },
                      { icon: "📈", label: `Wealth in ${years}yr`, value: `£${fmt(finalValue)}`,         sub: `at ${annualRate}% p.a.`,                     color: "text-blue-300"  },
                      { icon: "🎯", label: "Allocation",      value: `${allocData[0].value}% stocks`,    sub: `${profile.label} profile`,                   color: "text-white"     },
                    ].map(card => (
                      <div key={card.label} className="text-center">
                        <div className="text-2xl mb-1">{card.icon}</div>
                        <div className="text-xs text-gray-400 mb-1">{card.label}</div>
                        <div className={`text-lg font-bold ${card.color}`}>{card.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{card.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(3)} className="text-gray-400 hover:text-white text-sm transition">← Back</button>
                  <button onClick={() => setStep(1)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition border border-blue-800 px-4 py-2 rounded-lg">
                    ↺ Start Over
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
