import type { Metadata } from "next";

// ── Replace these two values once accounts are set up ──────────────────────
// 1. Stripe: create a Payment Link at dashboard.stripe.com → paste URL below
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/REPLACE_WITH_YOUR_LINK";
// 2. Formspree: sign up at formspree.io → create form → paste endpoint below
const FORMSPREE_ENDPOINT  = "https://formspree.io/f/REPLACE_WITH_YOUR_ID";
// ───────────────────────────────────────────────────────────────────────────

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
        {/* Glow */}
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
                  ["🛢️", "Commodities",        "Live prices and charts for Gold, Oil, Copper, Wheat and more."],
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
                    "Export to PDF or Excel (Pro)",
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

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl font-bold mb-3">Simple &amp; Transparent</h2>
          <p className="text-gray-400 mb-12">Use everything free. Pay only if you want to export reports.</p>
          <div className="grid md:grid-cols-2 gap-6 text-left">

            <div className="bg-[#111827] border border-gray-700 rounded-2xl p-8">
              <div className="text-4xl font-extrabold text-white mb-1">€0</div>
              <p className="text-gray-500 text-sm mb-6 font-semibold uppercase tracking-wider">Free · Forever</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                {[
                  "All 11 finance tools",
                  "Personal & professional FP&A",
                  "CSV data downloads",
                  "Unlimited usage",
                  "No account required",
                ].map((item) => (
                  <li key={item} className="flex gap-2 items-center">
                    <span className="text-green-400 font-bold">✓</span>{item}
                  </li>
                ))}
              </ul>
              <a
                href="/dashboard"
                className="block text-center border border-blue-600 hover:bg-blue-600/10 text-blue-400 hover:text-blue-300 font-semibold py-3 rounded-xl transition"
              >
                Start Free
              </a>
            </div>

            <div className="bg-[#111827] border-2 border-blue-600 rounded-2xl p-8 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-blue-600 rounded-full px-4 py-1">
                Most Popular
              </span>
              <div className="text-4xl font-extrabold text-white mb-1">€4.99<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-500 text-sm mb-6 font-semibold uppercase tracking-wider">Pro Exports</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                {[
                  "Everything in Free",
                  "PDF report exports",
                  "Excel workbook exports",
                  "Priority support",
                  "Custom dashboard request",
                ].map((item) => (
                  <li key={item} className="flex gap-2 items-center">
                    <span className="text-green-400 font-bold">✓</span>{item}
                  </li>
                ))}
              </ul>
              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/25"
              >
                Get Pro Exports
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── Blog teaser ── */}
      <section className="py-20 px-6">
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
                className="block bg-[#0d1426] border border-gray-800 rounded-2xl p-6 hover:border-blue-700/50 transition group"
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

      {/* ── Contact ── */}
      <section id="contact" className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">Contact</p>
          <h2 className="text-3xl font-bold text-center mb-3">Get in Touch</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">
            Questions, custom dashboard requests, or Pro access — we reply within 24 hours.
          </p>
          <form action={FORMSPREE_ENDPOINT} method="POST" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <select className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 transition">
              <option value="">I am a...</option>
              <option>Individual investor</option>
              <option>Finance team / company</option>
              <option>Wealth manager</option>
              <option>Startup / founder</option>
              <option>Other</option>
            </select>
            <textarea
              rows={4}
              placeholder="How can we help? (custom dashboard, Pro access, question...)"
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/25"
            >
              Send Message
            </button>
          </form>
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
              <a href="/#pricing" className="hover:text-gray-300 transition">Pricing</a>
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
