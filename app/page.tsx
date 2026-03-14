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
          <span className="text-blue-400">for everyone.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Free FP&amp;A tools for individuals tracking investments and finance teams
          running forecasts, budgets and valuations — all in your browser, no installation.
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

      {/* ── Tools split ── */}
      <section className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">10 Free Tools</h2>
          <p className="text-gray-400 text-center mb-14">Split into personal finance and professional FP&amp;A.</p>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Personal */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">👤</span>
                <h3 className="text-white font-bold text-lg">Personal Finance</h3>
              </div>
              <ul className="space-y-3">
                {[
                  ["📊", "Portfolio Analysis", "Upload holdings. Analyse returns, risk and asset allocation."],
                  ["📉", "Stock Comparison", "Compare two tickers side by side — returns, volatility, ratios."],
                  ["📈", "Stock Analysis", "Price history, moving averages and cumulative return for any stock."],
                  ["🛢️", "Commodities", "Live prices and charts for Gold, Oil, Copper, Wheat and more."],
                ].map(([icon, name, desc]) => (
                  <li key={name as string} className="flex gap-3 items-start bg-[#111827] border border-gray-800 rounded-xl p-4 hover:border-blue-700 transition">
                    <span className="text-2xl mt-0.5">{icon}</span>
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
                  ["🏦", "Financial Model", "5-year P&L, cash flow and balance sheet with Excel export."],
                  ["📋", "Annual Budget", "Build and visualise your company budget month by month."],
                  ["💧", "Cash Flow Forecast", "13-week rolling cash forecast with PDF export."],
                  ["⚖️", "Break-Even Analysis", "Fixed costs, variable costs, margin of safety."],
                  ["💎", "DCF Valuation", "Discounted cash flow model with terminal value and sensitivity."],
                  ["🏠", "Lending / Mortgage", "Loan amortisation schedule and mortgage payment calculator."],
                ].map(([icon, name, desc]) => (
                  <li key={name as string} className="flex gap-3 items-start bg-[#111827] border border-gray-800 rounded-xl p-4 hover:border-blue-700 transition">
                    <span className="text-2xl mt-0.5">{icon}</span>
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

      {/* ── Why FinancePlots ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why FinancePlots?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["🔓", "Free & Open", "All tools are free. No account, no paywall. Open them and start working immediately."],
              ["📤", "Export Ready", "Download Excel spreadsheets and PDF reports from every professional tool."],
              ["🛡️", "Private by Default", "Nothing is stored. Your data stays in your browser — no servers, no tracking."],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="bg-[#0d1426] border border-gray-800 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-bold mb-2">{title as string}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom dashboards ── */}
      <section id="products" className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Need Something Custom?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            We build bespoke FP&amp;A dashboards tailored to your data — delivered in days, not months.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🐳",
                title: "Docker Delivery",
                desc: "We build your dashboard, you run it on your own servers. Your data never leaves your company.",
                tag: "Most Private",
              },
              {
                icon: "🔗",
                title: "Hosted Link",
                desc: "We build and host your dashboard. You get a professional URL to share with your team in days.",
                tag: "Most Popular",
              },
              {
                icon: "📊",
                title: "Power BI Consultancy",
                desc: "Already on Power BI? We specialise in finance-specific reports, DAX and P&L design.",
                tag: "Finance Focus",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-[#111827] border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {p.tag}
                </span>
                <h3 className="text-white font-bold text-lg mt-2 mb-3">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Request a Custom Dashboard</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">
            Tell us what you need — we'll get back to you within 24 hours.
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Work email"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="text"
              placeholder="Company name"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <textarea
              rows={4}
              placeholder="What do you need? (e.g. P&L dashboard, budget tracker, cash flow model...)"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Send Request
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-500 text-sm">
        © 2026 FinancePlots · FP&amp;A tools for individuals and finance teams
      </footer>

    </main>
  );
}
