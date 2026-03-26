import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinancePlots — Free FP&A Tools for Individuals & Companies",
  description:
    "Free financial planning & analysis tools for individuals, finance teams and wealth managers. Personal budget, portfolio analysis, cash flow forecast, DCF valuation and more. No signup.",
  alternates: { canonical: "https://www.financeplots.com" },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-24 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
          Free FP&amp;A Tools · No Signup · Works Instantly
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] max-w-4xl mb-6 tracking-tight">
          Financial tools for<br />
          <span className="text-blue-400">every type of user.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          FP&amp;A tools for individuals managing money, finance teams running forecasts,
          and wealth managers analysing portfolios — free, instant, no account needed.
        </p>
        <div className="flex gap-4 flex-wrap justify-center mb-16">
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-base transition shadow-lg shadow-blue-600/25"
          >
            Open Tools Free →
          </a>
          <a
            href="#contact"
            className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition"
          >
            Request a Custom Dashboard
          </a>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          {[
            ["11", "Free Tools"],
            ["2", "Categories"],
            ["10", "FP&A Articles"],
            ["0", "Signup Required"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-white">{num}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── See it in action ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">See it in action</p>
          <h2 className="text-3xl font-bold text-center mb-12">Watch the tools in action</h2>
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-[280px]">
                <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-2xl"
                    src="https://www.youtube.com/embed/z56d-d9_V6o"
                    title="Personal Budget Planner"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <p className="text-white font-semibold text-sm">Personal Budget Planner</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl transition shadow-lg shadow-blue-600/25"
            >
              Try All Tools Free →
            </a>
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">Who uses FinancePlots</p>
          <h2 className="text-3xl font-bold text-center mb-12">Built for every type of finance user</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "👤",
                title: "Individuals",
                points: [
                  "Track monthly budget & savings rate",
                  "Analyse your investment portfolio",
                  "Compare stocks & monitor markets",
                  "Plan your mortgage or loan",
                ],
              },
              {
                icon: "🏢",
                title: "Finance Teams & Companies",
                points: [
                  "5-year financial model with Excel export",
                  "13-week cash flow forecast + PDF",
                  "Annual budget builder",
                  "Break-even & DCF valuation",
                ],
              },
              {
                icon: "📈",
                title: "Wealth Managers",
                points: [
                  "Client portfolio performance & risk",
                  "Asset allocation analysis",
                  "Commodity & equity market monitoring",
                  "Exportable reports for clients",
                ],
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#111827] border border-gray-800 rounded-2xl p-7 hover:border-blue-700/50 transition">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.points.map((p) => (
                    <li key={p} className="flex gap-2 text-gray-400 text-sm">
                      <span className="text-blue-400 shrink-0 mt-0.5">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">The tools</p>
          <h2 className="text-3xl font-bold text-center mb-3">11 Free FP&amp;A Tools</h2>
          <p className="text-gray-400 text-center mb-14">Open instantly. No installation. No account.</p>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Personal */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-800">
                <span className="text-2xl">👤</span>
                <div>
                  <h3 className="text-white font-bold">Personal Finance</h3>
                  <p className="text-gray-500 text-xs">For individuals managing money & investments</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  ["💰", "Personal Budget",    "Monthly income, expense categories, savings rate and spending breakdown."],
                  ["📊", "Portfolio Analysis", "Upload holdings. Analyse returns, risk and asset allocation."],
                  ["📉", "Stock Comparison",   "Compare two tickers side by side — returns, volatility, key ratios."],
                  ["📈", "Stock Analysis",     "Price history, moving averages and cumulative return for any ticker."],
                  ["💹", "Compound Interest",  "See how your capital and monthly contributions grow. Uses historical market benchmarks."],
                  ["🏠", "Mortgage & Loans",   "Amortisation schedule and mortgage payment calculator."],
                ].map(([icon, name, desc]) => (
                  <li key={name as string} className="flex gap-3 items-start bg-[#0d1426] border border-gray-800 rounded-xl p-4 hover:border-blue-700/50 transition group">
                    <span className="text-xl mt-0.5">{icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm group-hover:text-blue-300 transition">{name as string}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc as string}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-800">
                <span className="text-2xl">🏢</span>
                <div>
                  <h3 className="text-white font-bold">Professional FP&amp;A</h3>
                  <p className="text-gray-500 text-xs">For finance teams, CFOs and analysts</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  ["🏦", "Financial Model",    "5-year P&L, cash flow and balance sheet with Excel export."],
                  ["📋", "Annual Budget",      "Build and visualise your company budget month by month."],
                  ["💧", "Cash Flow Forecast", "13-week rolling cash forecast with PDF export."],
                  ["⚖️", "Break-Even",         "Fixed costs, variable costs, contribution margin and margin of safety."],
                  ["💎", "DCF Valuation",      "Discounted cash flow model with terminal value and sensitivity table."],
                ].map(([icon, name, desc]) => (
                  <li key={name as string} className="flex gap-3 items-start bg-[#0d1426] border border-gray-800 rounded-xl p-4 hover:border-blue-700/50 transition group">
                    <span className="text-xl mt-0.5">{icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm group-hover:text-blue-300 transition">{name as string}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc as string}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* How it works */}
              <div className="mt-6 bg-blue-600/5 border border-blue-700/20 rounded-xl p-5">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">How it works</p>
                <ol className="space-y-2">
                  {[
                    "Click any tool — opens instantly in your browser",
                    "Enter your data in the sidebar",
                    "See live charts and KPIs update in real time",
                    "Export to PDF or Excel",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-2 text-gray-400 text-sm">
                      <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>{step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl transition shadow-lg shadow-blue-600/25"
            >
              Open All Tools Free →
            </a>
          </div>
        </div>
      </section>

      {/* ── Free Forever banner ── */}
      <section className="bg-[#0d1426] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-blue-600/5 border border-blue-700/30 rounded-2xl p-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
              Always Free
            </span>
            <h2 className="text-3xl font-bold mb-4">No pricing. No plans. No catch.</h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Every tool on FinancePlots is free — including PDF and Excel exports.
              No account, no credit card, no time limit. Finance tools should be accessible to everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                ["✓", "All 11 tools free"],
                ["✓", "PDF & Excel exports free"],
                ["✓", "No signup ever"],
                ["✓", "No ads"],
              ].map(([check, text]) => (
                <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-green-400 font-bold">{check}</span>{text}
                </div>
              ))}
            </div>
            <a
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl transition shadow-lg shadow-blue-600/25"
            >
              Open All Tools →
            </a>
          </div>
        </div>
      </section>

      {/* ── Custom Dashboards ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">For companies</p>
          <h2 className="text-3xl font-bold text-center mb-4">Need a custom dashboard?</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-14 leading-relaxed">
            We build bespoke financial dashboards for companies — branded, connected to your data,
            and delivered as a hosted link or self-hosted Docker file.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: "📊",
                title: "Revenue & KPI Dashboard",
                desc: "Monthly revenue, burn rate, MoM growth, churn — all from your spreadsheet or database.",
              },
              {
                icon: "💰",
                title: "Cash Flow Monitor",
                desc: "13-week rolling forecast with actuals tracking, variance alerts and PDF reporting.",
              },
              {
                icon: "📈",
                title: "Portfolio Tracker",
                desc: "Client-facing portfolio dashboard with performance, allocation and risk metrics.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0d1426] border border-gray-800 rounded-2xl p-7 hover:border-blue-700/50 transition">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#0d1426] border border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl mb-2">How it works</h3>
              <ol className="space-y-2">
                {[
                  "You describe the KPIs and data sources you need",
                  "We build a custom Streamlit dashboard in 3–5 days",
                  "Delivered as a hosted link or Docker file (runs in your environment)",
                  "One-time project fee — no recurring charges",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3 text-gray-400 text-sm">
                    <span className="text-blue-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>{step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="shrink-0">
              <a
                href="#contact"
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-blue-600/25 text-sm"
              >
                Request a Custom Dashboard →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog teaser ── */}
      <section className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">From the blog</p>
          <h2 className="text-3xl font-bold text-center mb-12">FP&amp;A Guides &amp; Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { slug: "cash-flow-forecast-guide", tag: "Corporate Finance", title: "The 13-Week Cash Flow Forecast: Why Every Business Needs One" },
              { slug: "investment-portfolio-analysis", tag: "Personal Finance", title: "How to Analyse Your Investment Portfolio: Return, Risk and Diversification" },
              { slug: "dcf-valuation-guide", tag: "Valuation", title: "DCF Valuation Explained: How to Value a Business" },
            ].map((a) => (
              <a
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="block bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-blue-700/50 transition group"
              >
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{a.tag}</span>
                <h3 className="text-white font-semibold mt-2 text-sm leading-snug group-hover:text-blue-300 transition">{a.title}</h3>
                <span className="text-gray-500 text-xs mt-3 block">Read article →</span>
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/blog" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition">
              View all 10 articles →
            </a>
          </div>
        </div>
      </section>

      {/* ── Book ── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0d1426] border border-blue-700/30 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="text-6xl shrink-0">📖</div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">By the FinancePlots founder</p>
              <h2 className="text-2xl font-bold text-white mb-2">Your Money Rules</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                A practical personal finance book to help you take control of your money, build better habits, and make smarter financial decisions.
              </p>
              <a
                href="https://www.amazon.co.uk/Your-money-rules-Javier-Audibert-ebook/dp/B0GT78FLKJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3 rounded-xl transition shadow-lg shadow-blue-600/25 text-sm"
              >
                Get the book on Amazon →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">Contact</p>
          <h2 className="text-3xl font-bold text-center mb-3">Get in Touch</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">
            Questions, custom dashboard requests, or feedback — we reply within 24 hours.
          </p>
          <div className="text-center">
            <a
              href="mailto:hello@financeplots.com"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-blue-600/25"
            >
              Email us at hello@financeplots.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-white font-bold text-xl mb-1">
                Finance<span className="text-blue-400">Plots</span>
              </div>
              <p className="text-gray-500 text-xs">FP&amp;A tools for individuals, companies and wealth managers</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="/dashboard" className="hover:text-gray-300 transition">Tools</a>
              <a href="/blog" className="hover:text-gray-300 transition">Blog</a>
              <a href="/#contact" className="hover:text-gray-300 transition">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-600 text-xs">
            © 2026 FinancePlots · Not financial advice
          </div>
        </div>
      </footer>

    </main>
  );
}
