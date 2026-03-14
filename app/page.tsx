export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-36 pb-28">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-4 py-1.5 mb-6">
          FP&amp;A Tools · Free · No Signup
        </span>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl mb-6">
          Financial planning &amp; analysis<br />
          <span className="text-blue-400">for individuals and companies.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-10">
          Free FP&amp;A tools for individuals managing personal finances, finance teams
          running budgets and forecasts, and wealth managers analysing portfolios — all
          in your browser, no installation required.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Open Tools Free →
          </a>
          <a
            href="#contact"
            className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Request a Custom Dashboard
          </a>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="bg-[#0d1426] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Built for every type of finance user</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "👤",
                title: "Individuals",
                desc: "Track your personal budget, analyse your investment portfolio, compare stocks, monitor commodities, and plan your mortgage — all in one place.",
              },
              {
                icon: "🏢",
                title: "Finance Teams & Companies",
                desc: "Build 5-year financial models, run 13-week cash flow forecasts, break-even analyses, DCF valuations, and annual budgets — export to Excel and PDF.",
              },
              {
                icon: "📈",
                title: "Wealth Managers",
                desc: "Analyse client portfolios, track returns and volatility, compare assets, and monitor commodity and equity markets with exportable reports.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#111827] border border-gray-800 rounded-xl p-6 text-center hover:border-blue-700 transition">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">11 Free FP&amp;A Tools</h2>
          <p className="text-gray-400 text-center mb-14">Personal finance and professional FP&amp;A — open instantly, no account needed.</p>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Personal */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">👤</span>
                <h3 className="text-white font-bold text-lg">Personal Finance</h3>
              </div>
              <ul className="space-y-3">
                {[
                  ["💰", "Personal Budget",    "Monthly income, expense categories, savings rate and spending breakdown."],
                  ["📊", "Portfolio Analysis", "Upload holdings. Analyse returns, risk and asset allocation."],
                  ["📉", "Stock Comparison",   "Compare two tickers side by side — returns, volatility, key ratios."],
                  ["📈", "Stock Analysis",     "Price history, moving averages and cumulative return for any stock."],
                  ["🛢️", "Commodities",        "Live prices and charts for Gold, Oil, Copper, Wheat and more."],
                  ["🏠", "Mortgage & Loans",   "Amortisation schedule, mortgage payment calculator and loan comparison."],
                ].map(([icon, name, desc]) => (
                  <li key={name as string} className="flex gap-3 items-start bg-[#0d1426] border border-gray-800 rounded-xl p-4 hover:border-blue-700 transition">
                    <span className="text-xl mt-0.5">{icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{name as string}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc as string}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🏢</span>
                <h3 className="text-white font-bold text-lg">Professional FP&amp;A</h3>
              </div>
              <ul className="space-y-3">
                {[
                  ["🏦", "Financial Model",    "5-year P&L, cash flow and balance sheet with Excel export."],
                  ["📋", "Annual Budget",      "Build and visualise your company budget month by month."],
                  ["💧", "Cash Flow Forecast", "13-week rolling cash forecast with PDF export."],
                  ["⚖️", "Break-Even",         "Fixed costs, variable costs, contribution margin, margin of safety."],
                  ["💎", "DCF Valuation",      "Discounted cash flow model with terminal value and sensitivity table."],
                ].map(([icon, name, desc]) => (
                  <li key={name as string} className="flex gap-3 items-start bg-[#0d1426] border border-gray-800 rounded-xl p-4 hover:border-blue-700 transition">
                    <span className="text-xl mt-0.5">{icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{name as string}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc as string}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Open All Tools Free
            </a>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Simple Pricing</h2>
          <p className="text-gray-400 mb-12">Use everything free. Pay only if you want to export reports.</p>
          <div className="grid md:grid-cols-2 gap-6 text-left">

            <div className="bg-[#111827] border border-gray-700 rounded-xl p-8">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Free</span>
              <div className="text-4xl font-bold text-white mt-2 mb-1">€0</div>
              <p className="text-gray-400 text-sm mb-6">Forever free</p>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  "All 11 finance tools",
                  "Unlimited usage",
                  "Personal & professional tools",
                  "No account required",
                  "CSV downloads included",
                ].map((item) => (
                  <li key={item} className="flex gap-2 items-center">
                    <span className="text-green-400">✓</span>{item}
                  </li>
                ))}
              </ul>
              <a
                href="/dashboard"
                className="mt-8 block text-center border border-blue-600 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold py-3 rounded-lg transition"
              >
                Start Free
              </a>
            </div>

            <div className="bg-[#111827] border border-blue-600 rounded-xl p-8 relative">
              <span className="absolute top-4 right-4 text-xs font-bold text-white bg-blue-600 rounded-full px-3 py-1">Popular</span>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pro Exports</span>
              <div className="text-4xl font-bold text-white mt-2 mb-1">€4.99<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 text-sm mb-6">Or pay per download</p>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  "Everything in Free",
                  "PDF report exports",
                  "Excel workbook exports",
                  "Priority support",
                  "Custom dashboard request",
                ].map((item) => (
                  <li key={item} className="flex gap-2 items-center">
                    <span className="text-green-400">✓</span>{item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Get Pro Exports
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Get in Touch</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">
            Questions, custom dashboard requests, or Pro access — we reply within 24 hours.
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <select className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 transition">
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
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/blog" className="hover:text-gray-300 transition">Blog</a>
          <a href="#pricing" className="hover:text-gray-300 transition">Pricing</a>
          <a href="#contact" className="hover:text-gray-300 transition">Contact</a>
        </div>
        © 2026 FinancePlots · FP&amp;A tools for individuals, companies and wealth managers
      </footer>

    </main>
  );
}
