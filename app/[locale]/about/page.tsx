import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Javier Audibert | FinancePlots",
  description:
    "Javier Audibert, ACCA — 20+ years in finance across biotech, higher education and financial services. Finance Business Partner, FP&A and Power BI specialist behind FinancePlots.",
  alternates: { canonical: "https://www.financeplots.com/about" },
};

const EXPERIENCE = [
  {
    role: "Finance Manager",
    org: "Optellum Group",
    period: "Jan 2026 – Present",
    bullets: [
      "Lead the finance function end-to-end for a VC-backed AI healthcare company, coordinating with third-party accountants.",
      "Prepare multi-currency group consolidation accounts and bimonthly payment runs.",
      "Designed and implemented a Capex reporting solution in Power BI across multiple cost centres and functions.",
      "Calculate commissions and support the sales team on recurring revenue modelling.",
      "Prepare investor reporting packs; administer shareholder management system including cap tables and stock options.",
    ],
  },
  {
    role: "Management Accountant",
    org: "Department of Engineering, University of Oxford",
    period: "Jan 2024 – Dec 2025",
    bullets: [
      "Designed and implemented a full Power BI variance reporting solution from scratch, providing actionable monthly insight to division heads and senior stakeholders.",
      "Managed yearly budgets and quarterly forecasts aligned with university financial strategy.",
      "Oversaw general ledger, sales invoicing, and fixed asset registers (capitalisation and insurance compliance).",
      "Partnered with Capital Programs team on budgets, forecasts and variance analysis for major infrastructure investments.",
      "Conducted month-end journals, prepayments and fixed asset updates across Oracle R12 and Cognos MT1 (BFT).",
    ],
  },
  {
    role: "Finance Manager / Head of Finance",
    org: "Neuro-Bio Ltd.",
    period: "Aug 2022 – Dec 2023",
    bullets: [
      "Built the in-house finance function from the ground up, eliminating reliance on external outsourcing.",
      "Delivered FP&A including 12-year risk-adjusted DCF models (preclinical to commercialisation) for VC funding pitches and strategic planning.",
      "Prepared Board packs and venture capital reports; attended Board meetings as finance lead.",
      "Managed general ledger, purchase ledger, fixed assets and monthly management accounts with variance analysis.",
      "Computed R&D tax credit claims and maintained investor cap tables and documentation.",
      "Led a team of 3 finance professionals. Tools: Xero.",
    ],
  },
  {
    role: "FP&A Manager",
    org: "Psioxus Therapeutics",
    period: "Oct 2020 – Jul 2022",
    bullets: [
      "Partnered with departments on budgeting, financial performance and clinical trial financial planning.",
      "Built 5-year financial models and managed month-end close including 3-statement reporting.",
      "Maintained fixed asset registers; managed payment runs and month-end processes. Tools: Sage, Power BI.",
    ],
  },
  {
    role: "Management Accountant",
    org: "B2M Solutions",
    period: "Nov 2017 – Oct 2020",
    bullets: [
      "Delivered monthly management accounts (P&L, balance sheet, cash flow) with accruals, prepayments and deferred income.",
      "Produced sales reporting including ARR, MRR, churn rate and weighted/unweighted forecasts.",
      "Partnered with sales and operations for forecasting and variance analysis; prepared audit packs and R&D tax credit reports. Tools: Xero, QuickBooks.",
    ],
  },
  {
    role: "Senior Finance Assistant",
    org: "Proforest Ltd.",
    period: "Aug 2015 – Nov 2017",
    bullets: [
      "Produced accounts to trial balance; partnered with subsidiaries in Brazil and Colombia on financial management. Tools: Sage.",
    ],
  },
  {
    role: "Finance Assistant (Oncology Department)",
    org: "University of Oxford",
    period: "Sep 2014 – Aug 2015",
    bullets: [
      "Managed costing for Phase I clinical trials and invoice processing.",
    ],
  },
  {
    role: "Client Operations Manager",
    org: "Abante Asesores Group, Madrid",
    period: "Feb 2006 – Mar 2013",
    bullets: [
      "Reported to Spanish financial authorities managing operations for funds, stocks and SICAVs.",
      "Conducted NAV calculations; participated in investment and risk committees.",
    ],
  },
];

const EDUCATION = [
  { title: "ACCA Member", org: "Association of Chartered Certified Accountants", year: "2023" },
  { title: "Investment Management Certificate (IMC)", org: "CFA UK", year: "2013" },
  { title: "Masters in Corporate Finance & Law", org: "ESADE Business School, Madrid", year: "2011" },
  { title: "European Financial Advisor (EFA)", org: "EFPA — European Financial Planning Association", year: "2007" },
  { title: "BA in Law", org: "Universidad Complutense de Madrid", year: "2001" },
  { title: "Python Programming for Data Science — Parts 1 & 2", org: "Claude AI-assisted curriculum", year: "" },
];

const SKILLS = [
  {
    label: "Data & Reporting",
    items: "Power BI (advanced) — variance reports, dashboards, DAX, production solutions built from scratch",
  },
  {
    label: "Analytics",
    items: "Python (pandas, numpy, matplotlib, scikit-learn, Streamlit); Advanced Excel (Pivot Tables, Power Query, INDEX-MATCH, VLOOKUP)",
  },
  {
    label: "Finance Systems",
    items: "Oracle R12, Cognos MT1 (BFT), Xero, Sage, QuickBooks",
  },
  {
    label: "Finance Expertise",
    items: "FP&A, Budgeting & Forecasting, Variance Analysis, Management Accounts, Fixed Assets, DCF Modelling, Multi-currency Consolidation, R&D Tax Credits",
  },
  {
    label: "AI & Automation",
    items: "Claude AI, Python automation, financial data pipelines",
  },
];

const ACHIEVEMENTS = [
  {
    icon: "📊",
    title: "Power BI — built from scratch",
    desc: "Designed and implemented a complete Power BI variance reporting solution from scratch at the University of Oxford Engineering Department, delivering real-time insight to division stakeholders.",
  },
  {
    icon: "🏗️",
    title: "Finance function build-out",
    desc: "Built Neuro-Bio's entire in-house finance function, replacing external outsourcing and saving significant costs while managing Board packs, VC reporting and 12-year DCF models.",
  },
  {
    icon: "🧬",
    title: "Biotech FP&A at scale",
    desc: "Led FP&A across three biotech organisations (Optellum, Neuro-Bio, Psioxus) — 5-year plans, clinical trial budgeting, R&D tax credits and multi-currency consolidation.",
  },
  {
    icon: "👥",
    title: "Team leadership",
    desc: "Managed and mentored a finance team of 3 at Neuro-Bio, contributing to successful funding rounds through robust investor-ready financials and cap table management.",
  },
  {
    icon: "🎓",
    title: "Triple-qualified",
    desc: "ACCA, CFA UK (IMC) and EFPA European Financial Advisor (EFA) — combining accountancy rigour with investment management and financial planning perspectives.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* ── Hero ── */}
      <section className="relative px-6 pt-36 pb-20 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
            About
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight text-gray-900">
            Javier <span className="text-blue-600">Audibert</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-4 font-semibold">
            ACCA · Finance Business Partner · FP&A · Power BI
          </p>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Senior finance professional and ACCA member with 20+ years of progressive finance experience and 10+ years in FP&A and business partnering across biotech, higher education and financial services. Builder of the tools behind FinancePlots.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8 text-sm text-gray-600">
            <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">📍 Oxfordshire, UK</span>
            <a href="mailto:hello@financeplots.com" className="px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:border-blue-400 hover:text-blue-700 transition">
              ✉️ hello@financeplots.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Key achievements ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Highlights</p>
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Key achievements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.title} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition">
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">{a.icon}</span>
                  <div>
                    <h3 className="text-gray-900 font-bold mb-1">{a.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education & Qualifications ── */}
      <section className="bg-gray-50 border-y border-gray-200 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Education & Qualifications</p>
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Academic & professional credentials</h2>
          <ul className="space-y-3">
            {EDUCATION.map((e) => (
              <li key={e.title} className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div>
                  <p className="text-gray-900 font-bold">{e.title}</p>
                  <p className="text-gray-500 text-sm">{e.org}</p>
                </div>
                {e.year && (
                  <span className="shrink-0 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-3 py-1">
                    {e.year}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Skills & Tools ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Skills & Tools</p>
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Technical and finance toolkit</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SKILLS.map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">{s.label}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{s.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Professional experience ── */}
      <section className="bg-gray-50 border-y border-gray-200 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Experience</p>
          <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">20+ years in finance</h2>
          <p className="text-gray-600 text-center text-sm mb-10 max-w-2xl mx-auto">
            10+ years in progressive FP&A and business partnering roles, spanning biotech, higher education and financial services — from building finance functions from scratch to delivering Board-ready reporting.
          </p>
          <div className="space-y-5">
            {EXPERIENCE.map((x) => (
              <div key={`${x.org}-${x.period}`} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-gray-900 font-bold text-lg">{x.role}</h3>
                    <p className="text-blue-700 text-sm font-semibold">{x.org}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                    {x.period}
                  </span>
                </div>
                <ul className="space-y-2 mt-3">
                  {x.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-gray-600 text-sm leading-relaxed">
                      <span className="text-blue-500 shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Let&apos;s build something</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Interested in a custom Power BI reporting suite, FP&A support or a bespoke finance tool? Drop me a line.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@financeplots.com"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              Get in touch
            </a>
            <Link
              href="/tools"
              className="border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 font-semibold px-8 py-3 rounded-xl transition bg-white"
            >
              Explore the tools →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
