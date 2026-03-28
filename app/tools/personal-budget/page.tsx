"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const fmt = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });

const CURRENCIES = ["£", "$", "€", "¥", "₹"];

const EXPENSE_GROUPS = [
  {
    category: "Housing",
    color: "#3b82f6",
    items: [
      { key: "rent", label: "Rent / Mortgage", default: 1200 },
      { key: "utilities", label: "Utilities", default: 150 },
      { key: "insurance", label: "Home Insurance", default: 50 },
      { key: "maintenance", label: "Maintenance", default: 50 },
    ],
  },
  {
    category: "Transport",
    color: "#8b5cf6",
    items: [
      { key: "car_loan", label: "Car Loan / Lease", default: 300 },
      { key: "fuel", label: "Fuel / Public Transport", default: 150 },
      { key: "car_insurance", label: "Car Insurance", default: 80 },
      { key: "parking", label: "Parking / Other", default: 30 },
    ],
  },
  {
    category: "Food",
    color: "#f59e0b",
    items: [
      { key: "groceries", label: "Groceries", default: 400 },
      { key: "dining", label: "Dining Out", default: 150 },
      { key: "coffee", label: "Coffee / Snacks", default: 60 },
    ],
  },
  {
    category: "Health",
    color: "#22c55e",
    items: [
      { key: "gym", label: "Gym / Fitness", default: 40 },
      { key: "medical", label: "Medical / Dental", default: 50 },
      { key: "pharmacy", label: "Pharmacy", default: 20 },
    ],
  },
  {
    category: "Entertainment",
    color: "#ec4899",
    items: [
      { key: "subscriptions", label: "Subscriptions (Netflix etc.)", default: 40 },
      { key: "hobbies", label: "Hobbies", default: 80 },
      { key: "events", label: "Events / Outings", default: 60 },
    ],
  },
  {
    category: "Personal",
    color: "#14b8a6",
    items: [
      { key: "clothing", label: "Clothing", default: 80 },
      { key: "personal_care", label: "Personal Care", default: 40 },
      { key: "gifts", label: "Gifts / Charity", default: 30 },
    ],
  },
  {
    category: "Education",
    color: "#f97316",
    items: [
      { key: "courses", label: "Courses / Books", default: 30 },
      { key: "student_loan", label: "Student Loan", default: 0 },
      { key: "childcare", label: "Childcare / School", default: 0 },
    ],
  },
  {
    category: "Financial",
    color: "#6366f1",
    items: [
      { key: "savings_transfer", label: "Savings Transfer", default: 200 },
      { key: "investments", label: "Investments", default: 200 },
      { key: "debt_repayment", label: "Debt Repayment", default: 0 },
    ],
  },
];

const INCOME_ITEMS = [
  { key: "salary", label: "Salary (net)", default: 4000 },
  { key: "side_hustle", label: "Side Hustle", default: 500 },
  { key: "rental", label: "Rental Income", default: 0 },
  { key: "dividends", label: "Dividends / Interest", default: 0 },
  { key: "other_income", label: "Other Income", default: 0 },
];

type Values = Record<string, number>;

function NumInput({ label, value, onChange, prefix }: { label: string; value: number; onChange: (v: number) => void; prefix: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="flex items-center bg-[#111827] border border-gray-700 rounded-lg px-3 py-1.5 focus-within:border-blue-500 transition">
        <span className="text-gray-500 text-sm mr-1.5 shrink-0">{prefix}</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="bg-transparent text-white text-sm w-full outline-none"
        />
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color = "blue" }: { label: string; value: string; sub: string; color?: "blue" | "green" | "red" | "gold" }) {
  const border = color === "green" ? "border-l-green-500" : color === "red" ? "border-l-red-500" : color === "gold" ? "border-l-yellow-400" : "border-l-blue-500";
  return (
    <div className={`bg-[#0d1426] border border-gray-800 border-l-4 ${border} rounded-xl p-4`}>
      <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{label}</div>
      <div className="text-2xl font-extrabold text-white leading-tight">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}

export default function PersonalBudgetPage() {
  const [budgetName, setBudgetName] = useState("My Budget");
  const [currency, setCurrency] = useState("£");
  const [income, setIncome] = useState<Values>(() =>
    Object.fromEntries(INCOME_ITEMS.map(i => [i.key, i.default]))
  );
  const [expenses, setExpenses] = useState<Values>(() =>
    Object.fromEntries(EXPENSE_GROUPS.flatMap(g => g.items.map(i => [i.key, i.default])))
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EXPENSE_GROUPS.map((g, i) => [g.category, i === 0]))
  );
  const [isExporting, setIsExporting] = useState(false);
  const [pdfError, setPdfError] = useState<string>("");

  const toggleGroup = (cat: string) =>
    setOpenGroups(prev => ({ ...prev, [cat]: !prev[cat] }));

  const totalIncome = useMemo(() => Object.values(income).reduce((a, b) => a + b, 0), [income]);
  const totalExpenses = useMemo(() => Object.values(expenses).reduce((a, b) => a + b, 0), [expenses]);
  const netSaving = totalIncome - totalExpenses;
  const savingRate = totalIncome > 0 ? (netSaving / totalIncome) * 100 : 0;

  const categoryTotals = useMemo(() =>
    EXPENSE_GROUPS.map(g => ({
      category: g.category,
      color: g.color,
      monthly: g.items.reduce((a, i) => a + (expenses[i.key] ?? 0), 0),
    })).filter(c => c.monthly > 0).sort((a, b) => b.monthly - a.monthly),
  [expenses]);

  const pieData = categoryTotals.map(c => ({ name: c.category, value: c.monthly, color: c.color }));

  const barData = [
    { name: "Monthly", Income: totalIncome, Expenses: totalExpenses, Savings: Math.max(0, netSaving) },
    { name: "Annual", Income: totalIncome * 12, Expenses: totalExpenses * 12, Savings: Math.max(0, netSaving) * 12 },
  ];

  const pdfRows = useMemo(() =>
    EXPENSE_GROUPS.flatMap(g =>
      g.items
        .filter(i => expenses[i.key] > 0)
        .map(i => ({
          category: g.category,
          item: i.label,
          monthly: expenses[i.key],
          annual: expenses[i.key] * 12,
          pctExpenses: totalExpenses > 0 ? (expenses[i.key] / totalExpenses) * 100 : 0,
        }))
    ).sort((a, b) => b.monthly - a.monthly),
  [expenses, totalExpenses]);

  const handleExportPdf = useCallback(async () => {
    setIsExporting(true);
    setPdfError("");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: PersonalBudgetPDF } = await import("./pdf");
      const blob = await pdf(
        <PersonalBudgetPDF
          budgetName={budgetName}
          currency={currency}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netSaving={netSaving}
          savingRate={savingRate}
          rows={pdfRows}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "personal-budget.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : "PDF generation failed");
    } finally {
      setIsExporting(false);
    }
  }, [budgetName, currency, totalIncome, totalExpenses, netSaving, savingRate, pdfRows]);

  const fmtC = (n: number) => `${currency}${fmt(Math.abs(n))}`;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-[#0d1426]/95 backdrop-blur border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/tools" className="text-gray-400 hover:text-white text-sm transition">← All Tools</Link>
            <span className="text-gray-700 hidden sm:block">|</span>
            <h1 className="text-white font-bold hidden sm:block">💰 Personal Budget Planner</h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              {isExporting ? "Generating…" : "📄 Export PDF"}
            </button>
            {pdfError && <p className="text-red-400 text-xs max-w-xs text-right">{pdfError}</p>}
          </div>
        </div>
      </div>

      <div className="pt-[133px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-72 xl:w-80 shrink-0">
              <div className="lg:sticky lg:top-[133px] flex flex-col gap-4 max-h-[calc(100vh-153px)] overflow-y-auto pr-1">
                {/* Settings */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Settings</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400">Budget Name</label>
                      <input
                        value={budgetName}
                        onChange={e => setBudgetName(e.target.value)}
                        className="bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400">Currency</label>
                      <div className="flex gap-2 flex-wrap">
                        {CURRENCIES.map(c => (
                          <button
                            key={c}
                            onClick={() => setCurrency(c)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${currency === c ? "bg-blue-600 text-white" : "bg-[#111827] text-gray-400 border border-gray-700 hover:text-white"}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Income */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-3">Income</h3>
                  <div className="flex flex-col gap-2">
                    {INCOME_ITEMS.map(item => (
                      <NumInput
                        key={item.key}
                        label={item.label}
                        value={income[item.key]}
                        onChange={v => setIncome(prev => ({ ...prev, [item.key]: v }))}
                        prefix={currency}
                      />
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between text-sm">
                    <span className="text-gray-400">Total Income</span>
                    <span className="text-green-400 font-bold">{fmtC(totalIncome)}</span>
                  </div>
                </div>

                {/* Expenses header */}
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400">Monthly Expenses</p>
                  <button
                    onClick={() => setOpenGroups(Object.fromEntries(EXPENSE_GROUPS.map(g => [g.category, true])))}
                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                  >
                    Expand all
                  </button>
                </div>

                {/* Expenses */}
                {EXPENSE_GROUPS.map(group => (
                  <div key={group.category} className="bg-[#0d1426] border border-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleGroup(group.category)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/30 transition"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: group.color }}>
                        {group.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {fmtC(group.items.reduce((a, i) => a + (expenses[i.key] ?? 0), 0))}/mo
                        </span>
                        <span className="text-gray-500 text-xs">{openGroups[group.category] ? "▲" : "▼"}</span>
                      </div>
                    </button>
                    {openGroups[group.category] && (
                      <div className="px-5 pb-4 flex flex-col gap-2">
                        {group.items.map(item => (
                          <NumInput
                            key={item.key}
                            label={item.label}
                            value={expenses[item.key]}
                            onChange={v => setExpenses(prev => ({ ...prev, [item.key]: v }))}
                            prefix={currency}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <KpiCard label="Monthly Income" value={fmtC(totalIncome)} sub="All sources" color="green" />
                <KpiCard label="Monthly Expenses" value={fmtC(totalExpenses)} sub="All categories" color="red" />
                <KpiCard label="Monthly Savings" value={fmtC(netSaving)} sub="Net after expenses" color={netSaving >= 0 ? "green" : "red"} />
                <KpiCard
                  label="Savings Rate"
                  value={`${savingRate.toFixed(1)}%`}
                  sub="Target: 20%+"
                  color={savingRate >= 20 ? "green" : savingRate >= 10 ? "blue" : "red"}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Spending Breakdown Donut */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                  <h2 className="text-white font-bold mb-4">Spending Breakdown</h2>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9", fontSize: 12 }}
                          formatter={(value: unknown) => [`${currency}${fmt(Number(value))}`, undefined]}
                        />
                        <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 11, paddingTop: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-gray-500 text-sm">No expenses entered</div>
                  )}
                </div>

                {/* Income vs Expenses Bar */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                  <h2 className="text-white font-bold mb-4">Income vs Expenses</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#374151" tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <YAxis
                        stroke="#374151"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        tickFormatter={v => v >= 1000 ? `${currency}${(v / 1000).toFixed(0)}k` : `${currency}${v}`}
                        width={65}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9", fontSize: 12 }}
                        formatter={(value: unknown) => [`${currency}${fmt(Number(value))}`, undefined]}
                      />
                      <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12, paddingTop: 8 }} />
                      <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Annual Summary */}
              <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold mb-4">Annual Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Annual Income", value: fmtC(totalIncome * 12), color: "text-green-400" },
                    { label: "Annual Expenses", value: fmtC(totalExpenses * 12), color: "text-red-400" },
                    { label: "Annual Savings", value: fmtC(netSaving * 12), color: netSaving >= 0 ? "text-blue-400" : "text-red-400" },
                    { label: "Savings Rate", value: `${savingRate.toFixed(1)}%`, color: savingRate >= 20 ? "text-green-400" : savingRate >= 10 ? "text-yellow-400" : "text-red-400" },
                  ].map(card => (
                    <div key={card.label} className="bg-[#111827] rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">{card.label}</div>
                      <div className={`text-lg font-bold ${card.color}`}>{card.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              {pdfRows.length > 0 && (
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                  <h2 className="text-white font-bold mb-4">Detailed Expense Breakdown</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          {["Category", "Item", "Monthly", "Annual", "% of Expenses"].map(h => (
                            <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider py-2 pr-4 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pdfRows.map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/20 transition text-xs">
                            <td className="py-2 pr-4 text-gray-400">{row.category}</td>
                            <td className="py-2 pr-4 text-white">{row.item}</td>
                            <td className="py-2 pr-4 text-blue-300 font-semibold">{fmtC(row.monthly)}</td>
                            <td className="py-2 pr-4 text-gray-300">{fmtC(row.annual)}</td>
                            <td className="py-2 pr-4 text-gray-400">{row.pctExpenses.toFixed(1)}%</td>
                          </tr>
                        ))}
                        <tr className="border-t border-gray-600 font-bold text-xs">
                          <td className="py-2 pr-4 text-gray-300" colSpan={2}>Total Expenses</td>
                          <td className="py-2 pr-4 text-red-400">{fmtC(totalExpenses)}</td>
                          <td className="py-2 pr-4 text-red-400">{fmtC(totalExpenses * 12)}</td>
                          <td className="py-2 pr-4 text-gray-400">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
