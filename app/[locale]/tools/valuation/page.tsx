"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ReferenceLine,
} from "recharts";

const fmt = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });
const fmtM = (n: number) => n.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function KpiCard({ label, value, sub, color = "blue" }: { label: string; value: string; sub: string; color?: "blue" | "green" | "gold" }) {
  const border = color === "green" ? "border-l-green-500" : color === "gold" ? "border-l-yellow-400" : "border-l-blue-500";
  return (
    <div className={`bg-[#0d1426] border border-gray-800 border-l-4 ${border} rounded-xl p-4`}>
      <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{label}</div>
      <div className="text-2xl font-extrabold text-white leading-tight">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}

function NumInput({ label, value, onChange, prefix = "£", step = 1000 }: {
  label: string; value: number; onChange: (v: number) => void; prefix?: string; step?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400 font-medium">{label}</label>
      <div className="flex items-center bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 focus-within:border-blue-500 transition">
        {prefix && <span className="text-gray-500 text-sm mr-1.5 shrink-0">{prefix}</span>}
        <input
          type="number"
          min={0}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="bg-transparent text-white text-sm w-full outline-none"
        />
      </div>
    </div>
  );
}

export default function ValuationPage() {
  const [companyName, setCompanyName] = useState("My Company");
  const [revenue, setRevenue] = useState(5000000);
  const [ebitda, setEbitda] = useState(1000000);
  const [netIncome, setNetIncome] = useState(700000);
  const [fcf, setFcf] = useState(800000);
  const [growthRate, setGrowthRate] = useState(10);
  const [discountRate, setDiscountRate] = useState(12);
  const [terminalGrowth, setTerminalGrowth] = useState(2.5);
  const [ebitdaMultiple, setEbitdaMultiple] = useState(8);
  const [peRatio, setPeRatio] = useState(15);
  const [isExporting, setIsExporting] = useState(false);

  const { dcfRows, dcfValue, epsValue, evValue, avgValuation } = useMemo(() => {
    const r = discountRate / 100;
    const g = growthRate / 100;
    const tg = terminalGrowth / 100;

    let cumPV = 0;
    let projectedFCF = fcf;
    const dcfRows = [];

    for (let yr = 1; yr <= 5; yr++) {
      projectedFCF = projectedFCF * (1 + g);
      const discountedFCF = projectedFCF / Math.pow(1 + r, yr);
      cumPV += discountedFCF;
      dcfRows.push({ year: yr, fcf: Math.round(projectedFCF), discountedFCF: Math.round(discountedFCF), cumulativePV: Math.round(cumPV) });
    }

    const terminalValue = (projectedFCF * (1 + tg)) / (r - tg);
    const pvTerminal = terminalValue / Math.pow(1 + r, 5);
    const dcfValue = Math.round(cumPV + pvTerminal);
    const epsValue = Math.round(netIncome * peRatio);
    const evValue = Math.round(ebitda * ebitdaMultiple);
    const avgValuation = Math.round((dcfValue + epsValue + evValue) / 3);

    return { dcfRows, dcfValue, epsValue, evValue, avgValuation };
  }, [fcf, growthRate, discountRate, terminalGrowth, netIncome, peRatio, ebitda, ebitdaMultiple]);

  const ebitdaMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
  const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
  const fcfMargin = revenue > 0 ? (fcf / revenue) * 100 : 0;

  const valuationBarData = [
    { name: "DCF", value: dcfValue, fill: "#3b82f6" },
    { name: "EV/EBITDA", value: evValue, fill: "#8b5cf6" },
    { name: "P/E", value: epsValue, fill: "#22c55e" },
    { name: "Average", value: avgValuation, fill: "#f59e0b" },
  ];

  const dcfChartData = dcfRows.map(r => ({
    year: `Y${r.year}`,
    "Free Cash Flow": r.fcf,
    "Discounted FCF": r.discountedFCF,
  }));

  const handleExportPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: ValuationPDF } = await import("./pdf");
      const blob = await pdf(
        <ValuationPDF
          companyName={companyName}
          revenue={revenue}
          ebitda={ebitda}
          netIncome={netIncome}
          fcf={fcf}
          growthRate={growthRate}
          discountRate={discountRate}
          terminalGrowth={terminalGrowth}
          ebitdaMultiple={ebitdaMultiple}
          peRatio={peRatio}
          dcfValue={dcfValue}
          epsValue={epsValue}
          evValue={evValue}
          avgValuation={avgValuation}
          dcfRows={dcfRows}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "business-valuation.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }, [companyName, revenue, ebitda, netIncome, fcf, growthRate, discountRate, terminalGrowth, ebitdaMultiple, peRatio, dcfValue, epsValue, evValue, avgValuation, dcfRows]);

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-[#0d1426]/95 backdrop-blur border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/tools" className="text-gray-400 hover:text-white text-sm transition">← All Tools</Link>
            <span className="text-gray-700 hidden sm:block">|</span>
            <h1 className="text-white font-bold hidden sm:block">🏢 Business Valuation Calculator</h1>
          </div>
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
          >
            {isExporting ? "Generating…" : "📄 Export PDF"}
          </button>
        </div>
      </div>

      <div className="pt-[133px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-72 xl:w-80 shrink-0">
              <div className="lg:sticky lg:top-[133px] flex flex-col gap-4">
                {/* Company */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Company</h3>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Company Name</label>
                    <input
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Financials */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Current Financials (Annual)</h3>
                  <div className="flex flex-col gap-3">
                    <NumInput label="Annual Revenue" value={revenue} onChange={setRevenue} step={100000} />
                    <NumInput label="EBITDA" value={ebitda} onChange={setEbitda} step={50000} />
                    <NumInput label="Net Income" value={netIncome} onChange={setNetIncome} step={50000} />
                    <NumInput label="Free Cash Flow (FCF)" value={fcf} onChange={setFcf} step={50000} />
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-800 space-y-1 text-xs text-gray-400">
                    <div className="flex justify-between"><span>EBITDA Margin</span><span className="text-white font-semibold">{fmtM(ebitdaMargin)}%</span></div>
                    <div className="flex justify-between"><span>Net Margin</span><span className="text-white font-semibold">{fmtM(netMargin)}%</span></div>
                    <div className="flex justify-between"><span>FCF Margin</span><span className="text-white font-semibold">{fmtM(fcfMargin)}%</span></div>
                  </div>
                </div>

                {/* DCF Assumptions */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">DCF Assumptions</h3>
                  <div className="flex flex-col gap-3">
                    <NumInput label="Revenue Growth Rate %" value={growthRate} onChange={setGrowthRate} prefix="%" step={0.5} />
                    <NumInput label="Discount Rate / WACC %" value={discountRate} onChange={setDiscountRate} prefix="%" step={0.5} />
                    <NumInput label="Terminal Growth Rate %" value={terminalGrowth} onChange={setTerminalGrowth} prefix="%" step={0.1} />
                  </div>
                </div>

                {/* Multiples */}
                <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Market Multiples</h3>
                  <div className="flex flex-col gap-3">
                    <NumInput label="EV/EBITDA Multiple" value={ebitdaMultiple} onChange={setEbitdaMultiple} prefix="×" step={0.5} />
                    <NumInput label="P/E Ratio" value={peRatio} onChange={setPeRatio} prefix="×" step={0.5} />
                  </div>
                  <div className="mt-3 bg-[#111827] rounded-lg p-3 text-xs text-gray-400">
                    <div className="font-semibold text-gray-300 mb-1">Typical multiples</div>
                    <div>EV/EBITDA: 6–12× (SMB), 15–25× (Tech)</div>
                    <div>P/E: 10–20× (mature), 25–50× (growth)</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <KpiCard label="Average Valuation" value={`£${fmt(avgValuation)}`} sub="3-method average" color="gold" />
                <KpiCard label="DCF Valuation" value={`£${fmt(dcfValue)}`} sub={`${discountRate}% WACC`} />
                <KpiCard label="EV/EBITDA Value" value={`£${fmt(evValue)}`} sub={`${ebitdaMultiple}× multiple`} />
                <KpiCard label="P/E Valuation" value={`£${fmt(epsValue)}`} sub={`${peRatio}× earnings`} color="green" />
              </div>

              {/* Valuation Comparison Chart */}
              <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold mb-5">Valuation by Method</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={valuationBarData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#374151" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis
                      stroke="#374151"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      tickFormatter={v => v >= 1000000 ? `£${(v / 1000000).toFixed(1)}M` : `£${(v / 1000).toFixed(0)}k`}
                      width={75}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9", fontSize: 12 }}
                      formatter={(value: unknown) => [`£${fmt(Number(value))}`, "Valuation"]}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {valuationBarData.map((entry, index) => (
                        <rect key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* DCF Chart */}
              <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold mb-5">DCF — Projected Free Cash Flows</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={dcfChartData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" stroke="#374151" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis
                      stroke="#374151"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      tickFormatter={v => v >= 1000000 ? `£${(v / 1000000).toFixed(1)}M` : `£${(v / 1000).toFixed(0)}k`}
                      width={75}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9", fontSize: 12 }}
                      formatter={(value: unknown) => [`£${fmt(Number(value))}`, undefined]}
                    />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="Free Cash Flow" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                    <Line type="monotone" dataKey="Discounted FCF" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#22c55e", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* DCF Table */}
              <div className="bg-[#0d1426] border border-gray-800 rounded-xl p-6">
                <h2 className="text-white font-bold mb-4">5-Year DCF Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        {["Year", "Free Cash Flow", "Discounted FCF", "Cumulative PV"].map(h => (
                          <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wider py-2 pr-4 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dcfRows.map(row => (
                        <tr key={row.year} className="border-b border-gray-800 hover:bg-gray-800/20 transition text-xs">
                          <td className="py-2 pr-4 text-white font-bold">Year {row.year}</td>
                          <td className="py-2 pr-4 text-blue-300 font-semibold">£{fmt(row.fcf)}</td>
                          <td className="py-2 pr-4 text-green-400">£{fmt(row.discountedFCF)}</td>
                          <td className="py-2 pr-4 text-gray-300">£{fmt(row.cumulativePV)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
