"use client";
import { useState } from "react";
import Link from "next/link";

// ── Data ─────────────────────────────────────────────────────────────────────

const Q1_OPTIONS = [
  { id: "individual", icon: "👤", label: "Individual", sub: "Personal finance & investing" },
  { id: "business",   icon: "🏢", label: "Business",   sub: "Company planning & analysis" },
];

const Q2_OPTIONS: Record<string, { id: string; icon: string; label: string; sub: string }[]> = {
  individual: [
    { id: "budget",  icon: "💸", label: "Track my budget",           sub: "Income, expenses & savings rate" },
    { id: "invest",  icon: "📊", label: "Grow my investments",       sub: "Portfolio, compound interest" },
    { id: "debt",    icon: "🏦", label: "Pay off debt / get a loan",  sub: "Loan repayments & interest" },
    { id: "plan",    icon: "🗺️", label: "Build a full financial plan", sub: "All-in-one: income → retirement" },
  ],
  business: [
    { id: "model",    icon: "📈", label: "Plan my next 5 years",          sub: "Revenue projections & P&L" },
    { id: "cashflow", icon: "💧", label: "Manage cash flow",               sub: "13-week rolling forecast" },
    { id: "profit",   icon: "⚖️", label: "Understand profitability",       sub: "Break-even & margin analysis" },
    { id: "value",    icon: "🏢", label: "Value or exit my business",      sub: "DCF, multiples & exit price" },
  ],
};

const Q3_OPTIONS = [
  { id: "yes", icon: "✅", label: "Yes, I have my numbers",   sub: "Ready to input real data" },
  { id: "no",  icon: "📝", label: "Not yet — I'll explore",   sub: "I'll start with estimates" },
];

interface ToolRec {
  name: string; icon: string; href: string; desc: string; primary?: boolean;
}

type Key = `${"individual" | "business"}-${string}-${"yes" | "no"}`;

const RECS: Record<Key, ToolRec[]> = {
  "individual-budget-yes": [
    { name: "Personal Budget Planner",     icon: "💸", href: "/tools/personal-budget",    desc: "Input your income and expenses now — get instant charts.", primary: true },
    { name: "Personal Financial Planner",  icon: "🗺️", href: "/tools/financial-planner",  desc: "Take it further: add debt, investments and a 5-year goal." },
  ],
  "individual-budget-no": [
    { name: "Personal Budget Planner",     icon: "💸", href: "/tools/personal-budget",    desc: "Start with rough numbers — you can refine as you go.", primary: true },
  ],
  "individual-invest-yes": [
    { name: "Portfolio Analysis",          icon: "📊", href: "/tools/portfolio-analysis",  desc: "Upload your holdings and see allocation, risk & returns.", primary: true },
    { name: "Compound Interest Calculator",icon: "💹", href: "/tools/compound-interest",   desc: "Model how your savings grow over time at different rates." },
  ],
  "individual-invest-no": [
    { name: "Compound Interest Calculator",icon: "💹", href: "/tools/compound-interest",   desc: "See the power of compounding with any starting amount.", primary: true },
    { name: "Personal Financial Planner",  icon: "🗺️", href: "/tools/financial-planner",  desc: "Set a 5-year goal and get a step-by-step plan." },
  ],
  "individual-debt-yes": [
    { name: "Lending Calculator",          icon: "🏦", href: "/tools/lending",             desc: "See exact monthly payments, total interest and payoff dates.", primary: true },
    { name: "Personal Financial Planner",  icon: "🗺️", href: "/tools/financial-planner",  desc: "Get personalised debt-reduction recommendations." },
  ],
  "individual-debt-no": [
    { name: "Lending Calculator",          icon: "🏦", href: "/tools/lending",             desc: "Try different loan amounts, rates and terms instantly.", primary: true },
  ],
  "individual-plan-yes": [
    { name: "Personal Financial Planner",  icon: "🗺️", href: "/tools/financial-planner",  desc: "5-step guided plan: income → debt → investing → goals → recommendations.", primary: true },
  ],
  "individual-plan-no": [
    { name: "Personal Financial Planner",  icon: "🗺️", href: "/tools/financial-planner",  desc: "Start with estimates — the planner will guide you through each step.", primary: true },
    { name: "Personal Budget Planner",     icon: "💸", href: "/tools/personal-budget",    desc: "Warm up by getting your income & expenses down first." },
  ],
  "business-model-yes": [
    { name: "5-Year Financial Model",      icon: "📈", href: "/tools/financial-model",     desc: "Build a full P&L, revenue breakdown and cash projection.", primary: true },
    { name: "Annual Budget",               icon: "💰", href: "/tools/annual-budget",       desc: "Lock in this year's numbers before projecting forward." },
  ],
  "business-model-no": [
    { name: "5-Year Financial Model",      icon: "📈", href: "/tools/financial-model",     desc: "Start with rough revenue assumptions — scenarios built in.", primary: true },
  ],
  "business-cashflow-yes": [
    { name: "13-Week Cash Flow Forecast",  icon: "💧", href: "/tools/cash-flow",           desc: "Enter your opening balance and weekly inflows/outflows.", primary: true },
    { name: "Annual Budget",               icon: "💰", href: "/tools/annual-budget",       desc: "Set the yearly context behind your weekly cash position." },
  ],
  "business-cashflow-no": [
    { name: "13-Week Cash Flow Forecast",  icon: "💧", href: "/tools/cash-flow",           desc: "Use estimates — the tool highlights danger weeks automatically.", primary: true },
  ],
  "business-profit-yes": [
    { name: "Break-Even Analysis",         icon: "⚖️", href: "/tools/break-even",          desc: "Enter your fixed costs, variable costs and price — see your break-even instantly.", primary: true },
    { name: "Financial Journey — Companies", icon: "🏢", href: "/tools/financial-planner-company", desc: "Full P&L, margins and business health score." },
  ],
  "business-profit-no": [
    { name: "Break-Even Analysis",         icon: "⚖️", href: "/tools/break-even",          desc: "Even rough estimates reveal how many units you need to sell.", primary: true },
  ],
  "business-value-yes": [
    { name: "Business Valuation",          icon: "🏢", href: "/tools/valuation",           desc: "DCF + revenue & EBITDA multiples — see a valuation range instantly.", primary: true },
    { name: "Financial Journey — Companies", icon: "🏢", href: "/tools/financial-planner-company", desc: "Includes exit price modelling alongside full P&L." },
  ],
  "business-value-no": [
    { name: "Business Valuation",          icon: "🏢", href: "/tools/valuation",           desc: "Start with estimated revenue and EBITDA — three valuation methods shown.", primary: true },
    { name: "Break-Even Analysis",         icon: "⚖️", href: "/tools/break-even",          desc: "Understand profitability first before looking at exit price." },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | "result";

export default function OnboardingFlow() {
  const [step, setStep]   = useState<Step>(1);
  const [q1, setQ1]       = useState<string>("");
  const [q2, setQ2]       = useState<string>("");
  const [q3, setQ3]       = useState<string>("");

  function pickQ1(id: string) { setQ1(id); setStep(2); }
  function pickQ2(id: string) { setQ2(id); setStep(3); }
  function pickQ3(id: string) { setQ3(id); setStep("result"); }
  function reset() { setQ1(""); setQ2(""); setQ3(""); setStep(1); }

  const recs = step === "result"
    ? (RECS[`${q1}-${q2}-${q3}` as Key] ?? [])
    : [];

  const q2Options = Q2_OPTIONS[q1] ?? [];

  const stepLabel = step === "result" ? "Your tools" : `Step ${step} of 3`;
  const progress  = step === "result" ? 100 : ((step as number) - 1) / 3 * 100;

  return (
    <section className="py-20 px-6 bg-[#070d1a]">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">
          Find your tool
        </p>
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">
          Not sure where to start?
        </h2>
        <p className="text-gray-400 text-center mb-10 text-sm">
          Answer 3 quick questions and we'll point you to the right tool.
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 shrink-0 font-medium">{stepLabel}</span>
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <p className="text-white font-bold text-lg mb-6 text-center">
              Are you planning for yourself or a business?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Q1_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => pickQ1(opt.id)}
                  className="group flex flex-col items-center gap-3 bg-[#0d1426] border border-gray-700 hover:border-blue-500 hover:bg-blue-900/10 rounded-2xl px-6 py-8 transition text-center"
                >
                  <span className="text-4xl">{opt.icon}</span>
                  <span className="text-white font-bold text-base group-hover:text-blue-300 transition">{opt.label}</span>
                  <span className="text-gray-500 text-xs">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <p className="text-white font-bold text-lg mb-6 text-center">
              What's your primary goal right now?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {q2Options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => pickQ2(opt.id)}
                  className="group flex items-start gap-3 bg-[#0d1426] border border-gray-700 hover:border-blue-500 hover:bg-blue-900/10 rounded-2xl p-5 transition text-left"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm group-hover:text-blue-300 transition">{opt.label}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{opt.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-xs text-gray-600 hover:text-gray-400 transition block mx-auto">
              ← Back
            </button>
          </div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <p className="text-white font-bold text-lg mb-6 text-center">
              Do you have your numbers ready?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Q3_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => pickQ3(opt.id)}
                  className="group flex flex-col items-center gap-3 bg-[#0d1426] border border-gray-700 hover:border-blue-500 hover:bg-blue-900/10 rounded-2xl px-6 py-7 transition text-center"
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="text-white font-bold text-sm group-hover:text-blue-300 transition">{opt.label}</span>
                  <span className="text-gray-500 text-xs">{opt.sub}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-6 text-xs text-gray-600 hover:text-gray-400 transition block mx-auto">
              ← Back
            </button>
          </div>
        )}

        {/* ── Result ── */}
        {step === "result" && (
          <div className="animate-fadeIn">
            <p className="text-white font-bold text-lg mb-2 text-center">
              Here's where to start 👇
            </p>
            <p className="text-gray-400 text-sm text-center mb-8">
              Based on your answers, these tools are the best fit.
            </p>

            <div className="flex flex-col gap-4">
              {recs.map((tool, i) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group flex items-center gap-5 rounded-2xl px-6 py-5 border transition ${
                    tool.primary
                      ? "bg-blue-600/10 border-blue-500/60 hover:bg-blue-600/20 hover:border-blue-400"
                      : "bg-[#0d1426] border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <span className="text-3xl shrink-0">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-base group-hover:text-blue-300 transition">
                        {tool.name}
                      </span>
                      {tool.primary && i === 0 && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Best match
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">{tool.desc}</p>
                  </div>
                  <span className="text-gray-600 group-hover:text-blue-400 transition text-lg shrink-0">→</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={reset}
                className="text-xs text-gray-500 hover:text-gray-300 transition underline underline-offset-2"
              >
                Start over
              </button>
              <Link
                href="/tools"
                className="text-xs text-blue-400 hover:text-blue-300 transition font-semibold"
              >
                Browse all 13 tools →
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
