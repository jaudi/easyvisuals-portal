import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download FinancePlots Desktop — Offline Finance Tools for Windows",
  description:
    "Download FinancePlots Desktop free — a private, offline-first finance app for Windows. Annual Budget, 5-Year Financial Model, and Personal Budget. Your data never leaves your machine.",
  alternates: { canonical: "https://www.financeplots.com/download" },
};

const FEATURES = [
  {
    icon: "🔒",
    title: "100% Private",
    desc: "All data stays on your machine. No cloud, no account, no tracking.",
  },
  {
    icon: "📴",
    title: "Works Offline",
    desc: "No internet required. Open and close whenever you like.",
  },
  {
    icon: "💾",
    title: "Save & Load",
    desc: "Save multiple scenarios and budgets locally, reload them any time.",
  },
  {
    icon: "💱",
    title: "Multi-Currency",
    desc: "Supports $, £, €, CHF, CA$, A$, ¥ and more.",
  },
];

const TOOLS = [
  {
    name: "Annual Budget",
    desc: "12-month P&L with revenue lines, direct costs, overheads, and EBITDA — fully editable monthly grid.",
    icon: "📊",
  },
  {
    name: "5-Year Financial Model",
    desc: "Income statement, cash flow, balance sheet, and key ratios driven by simple assumption sliders.",
    icon: "📈",
  },
  {
    name: "Personal Budget",
    desc: "Monthly income vs. expenses tracker across 8 categories with savings rate gauge and charts.",
    icon: "🏦",
  },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-20 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
          Desktop App — Windows
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl mb-6 tracking-tight">
          Finance Tools That Stay{" "}
          <span className="text-blue-400">On Your Machine</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed">
          FinancePlots Desktop gives you powerful FP&A tools without sending
          a single number to the cloud. One-time purchase, no subscription.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Main download CTA — points to GitHub Releases once live */}
          <a
            href="/api/download"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-base transition shadow-lg shadow-blue-600/25 flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download for Windows
          </a>

          <Link
            href="/dashboard"
            className="border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-medium px-8 py-4 rounded-xl text-base transition"
          >
            Try free web tools →
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-5">
          Windows 10 / 11 &nbsp;·&nbsp; ~80 MB &nbsp;·&nbsp; No installation of dependencies required
        </p>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition"
            >
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="font-bold text-white mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools included */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">What&apos;s Included</h2>
        <p className="text-gray-400 text-center mb-10">
          Three professional tools, fully offline.
        </p>
        <div className="space-y-4">
          {TOOLS.map((t) => (
            <div
              key={t.name}
              className="flex items-start gap-5 bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <span className="text-4xl shrink-0">{t.icon}</span>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">{t.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free CTA */}
      <section className="px-6 pb-28 max-w-lg mx-auto text-center">
        <div className="bg-gradient-to-b from-blue-900/40 to-blue-950/60 border border-blue-500/30 rounded-3xl p-10">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Free Download</p>
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-6xl font-extrabold text-white">Free</span>
          </div>
          <p className="text-gray-400 text-sm mb-8">
            Free to download and use. No account required.
          </p>
          <a
            href="/api/download"
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-base transition shadow-lg shadow-blue-600/25"
          >
            Download Now
          </a>
          <p className="text-gray-500 text-xs mt-4">
            Windows 10 / 11 only. Mac version coming soon.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/5 px-6 py-12 text-center">
        <p className="text-gray-500 text-sm">
          Want to try the tools for free first?{" "}
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition">
            Use the web version →
          </Link>
        </p>
      </section>
    </main>
  );
}
