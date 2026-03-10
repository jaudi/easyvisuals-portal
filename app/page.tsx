export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <span className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-4">
          Visual Analytics for Finance Teams
        </span>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl mb-6">
          Pay per <span className="text-blue-400">solution</span>,<br />not per user.
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Custom dashboards and finance tools — built for your data, delivered in days.
          No Power BI licensing. No per-seat fees.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Try Finance Tools
          </a>
          <a
            href="#contact"
            className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Request a Dashboard
          </a>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="bg-[#0d1426] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-8">
            <h3 className="text-red-400 font-bold text-lg mb-4">The Power BI Problem</h3>
            <ul className="text-gray-300 space-y-3 text-sm">
              <li>❌ $10–$20 per user per month</li>
              <li>❌ 50 employees = $500–$1,000/month</li>
              <li>❌ Complex licensing tiers</li>
              <li>❌ Requires internal BI expertise</li>
            </ul>
          </div>
          <div className="bg-blue-950/30 border border-blue-700/40 rounded-xl p-8">
            <h3 className="text-blue-400 font-bold text-lg mb-4">The FinancePlots Solution</h3>
            <ul className="text-gray-300 space-y-3 text-sm">
              <li>✅ Pay once per dashboard</li>
              <li>✅ Unlimited viewers, no per-seat fees</li>
              <li>✅ Delivered in days, not weeks</li>
              <li>✅ Your data stays in your environment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Three Ways to Work With Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Docker Delivery",
                desc: "We build, you run it internally. Data never leaves your company. Compliance-friendly.",
                tag: "Most Private",
              },
              {
                title: "Hosted Link",
                desc: "We build and host it. You get a professional URL ready to share in days.",
                tag: "Most Popular",
              },
              {
                title: "Power BI Consultancy",
                desc: "Already on Power BI? We specialise in finance-specific reports, DAX, and P&L design.",
                tag: "Finance Focus",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-[#0d1426] border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition"
              >
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {p.tag}
                </span>
                <h3 className="text-white font-bold text-lg mt-2 mb-3">{p.title}</h3>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Finance Tools CTA */}
      <section className="bg-[#0d1426] py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Try Our Free Finance Tools</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          5-Year Financial Model, Chart Builder, and more — live in your browser, no signup required.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Open Finance Tools
        </a>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Request a Dashboard</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Work email"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Company name"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <textarea
              rows={4}
              placeholder="What do you need? (e.g. P&L dashboard, sales tracker...)"
              className="w-full bg-[#0d1426] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
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

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-500 text-sm">
        © 2026 FinancePlots · Visual analytics for finance teams
      </footer>
    </main>
  );
}
