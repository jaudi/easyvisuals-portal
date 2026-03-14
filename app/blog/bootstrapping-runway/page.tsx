import Link from "next/link";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "Bootstrapping & Runway: How to Extend Your Startup's Life Without Giving Up Equity | FinancePlots",
  description: "How founders can think rigorously about burn rate, runway and capital efficiency — before the pressure is on.",
  openGraph: {
    title: "Bootstrapping & Runway: How to Extend Your Startup's Life Without Giving Up Equity",
    description: "How founders can think rigorously about burn rate, runway and capital efficiency — before the pressure is on.",
    url: "https://www.financeplots.com/blog/bootstrapping-runway",
    siteName: "FinancePlots",
    type: "article",
    images: [{ url: "https://www.financeplots.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bootstrapping & Runway: How to Extend Your Startup's Life Without Giving Up Equity",
    description: "How founders can think rigorously about burn rate, runway and capital efficiency — before the pressure is on.",
    images: ["https://www.financeplots.com/og-image.png"],
  },
};

export default function ArticleBootstrappingRunway() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 transition mb-8 inline-block">
          ← Back to Blog
        </Link>

        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Startup Finance</span>
        <h1 className="text-4xl font-bold mt-2 mb-3 leading-tight">
          Bootstrapping & Runway: How to Extend Your Startup&apos;s Life Without Giving Up Equity
        </h1>
        <p className="text-gray-400 text-sm mb-10">March 2026 · 7 min read</p>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-6">

          <p>
            Every month of runway is a month of optionality. It is a month to find product-market fit, to close that first enterprise customer, to prove the unit economics, to raise from a position of strength rather than desperation.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">The Fundamentals: Burn Rate and Runway</h2>
          <p><strong className="text-white">Burn rate</strong> is the net cash your business consumes each month. There are two versions:</p>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Gross burn: total monthly cash outflows (salaries, software, rent, marketing)",
              "Net burn: gross burn minus monthly revenue",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>
          <p>Net burn is what matters. A business with £60,000 in monthly costs and £20,000 in revenue has a net burn of £40,000/month.</p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg p-4 font-mono text-sm text-blue-300">
            Runway (months) = Cash in bank ÷ Monthly net burn
          </div>
          <p>
            If you have £400,000 in the bank and net burn of £40,000/month, you have 10 months of runway. Fundraising takes 3–6 months. You need to start the process with at least 6 months remaining, ideally 9. <strong className="text-white">Target runway: always maintain 12–18 months.</strong>
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">The Bootstrapping Mindset</h2>
          <p>Bootstrapping does not mean being cheap. It means being capital-efficient — maximising value generated per pound spent.</p>

          <h3 className="text-lg font-semibold text-white">1. Revenue before headcount</h3>
          <p>Hire when revenue justifies it, not when it feels right. Every hire should come with a clear revenue or cost justification. &quot;We need a VP of X&quot; is not a financial argument.</p>

          <h3 className="text-lg font-semibold text-white">2. Fixed costs are the enemy</h3>
          <p>Fixed costs burn at the same rate regardless of performance. Push as many costs as possible toward variable: freelancers over permanent hires, revenue-share deals over flat fees, pay-as-you-go infrastructure over committed contracts.</p>

          <h3 className="text-lg font-semibold text-white">3. Extend payment terms wherever possible</h3>
          <p>Negotiate 60–90 day payment terms with suppliers. Push customers toward upfront annual payments (offer a 10–15% discount — it is almost always worth it for the cash flow benefit).</p>

          <h2 className="text-2xl font-bold text-white mt-10">Scenario Planning for Runway</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Scenario</th>
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Description</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Implication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ["Base", "Revenue grows 10–15% MoM", "14 months runway"],
                  ["Downside", "Revenue flat for 3 months, then 5% MoM", "9 months — raise or cut"],
                  ["Upside", "Revenue grows 20%+ MoM", "Profitable in 8 months"],
                ].map(([s, d, i]) => (
                  <tr key={s}>
                    <td className="py-3 pr-6 text-blue-300 font-medium">{s}</td>
                    <td className="py-3 pr-6 text-gray-300">{d}</td>
                    <td className="py-3 text-gray-300">{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>The downside scenario is the most important. It forces the question: <em>&quot;What would we cut, and in what order, if revenue stalled for a quarter?&quot;</em></p>

          <h2 className="text-2xl font-bold text-white mt-10">When to Raise vs When to Bootstrap</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-950/30 border border-blue-700/40 rounded-xl p-5">
              <h4 className="text-blue-400 font-bold mb-3">Raise if:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  "Winner-take-all market dynamics",
                  "Unit economics proven, capital-constrained",
                  "Capital changes competitive position in 18 months",
                ].map((i) => <li key={i} className="flex gap-2"><span className="text-green-400">✓</span>{i}</li>)}
              </ul>
            </div>
            <div className="bg-[#0d1426] border border-gray-700 rounded-xl p-5">
              <h4 className="text-gray-300 font-bold mb-3">Bootstrap if:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  "No product-market fit yet",
                  "Market allows durable profitable business at smaller scale",
                  "More runway gets you to better proof points",
                ].map((i) => <li key={i} className="flex gap-2"><span className="text-yellow-400">→</span>{i}</li>)}
              </ul>
            </div>
          </div>
          <p>Dilution is permanent. Every pound of capital raised has a long-term cost — even if it does not feel that way in the moment.</p>

          <h2 className="text-2xl font-bold text-white mt-10">The Metrics Investors Focus On</h2>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Monthly Recurring Revenue (MRR) and its growth rate",
              "Net Revenue Retention (NRR) — are existing customers expanding or churning?",
              "CAC:LTV ratio — are you acquiring customers efficiently?",
              "Months to payback — how long before a new customer is profitable?",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>
          <p>A founder who can explain their unit economics in two minutes is a founder who raises faster and at better terms.</p>

        </div>

        <ShareButtons
          url="https://www.financeplots.com/blog/bootstrapping-runway"
          title="Bootstrapping & Runway: How to Extend Your Startup's Life Without Giving Up Equity"
        />

        <div className="mt-14 bg-[#0d1426] border border-blue-700/40 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Model Your Runway</h3>
          <p className="text-gray-400 text-sm mb-6">
            Free 5-Year Financial Model and Cash Flow Forecast — build your scenarios before your next investor conversation.
          </p>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition inline-block">
            Open Finance Tools
          </Link>
        </div>

        <p className="text-gray-600 text-xs mt-8 text-center">
          This article is for informational purposes only and does not constitute financial advice.
        </p>
      </div>
    </main>
  );
}
