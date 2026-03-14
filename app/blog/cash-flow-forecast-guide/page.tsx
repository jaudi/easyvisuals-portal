import Link from "next/link";

export default function CashFlowForecastGuide() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 transition mb-8 inline-block">
          ← Back to Blog
        </Link>

        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Corporate Finance</span>
        <h1 className="text-4xl font-bold mt-2 mb-3 leading-tight">
          The 13-Week Cash Flow Forecast: Why Every Business Needs One
        </h1>
        <p className="text-gray-400 text-sm mb-10">March 2026 · 7 min read</p>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-6">

          <p>
            Most businesses fail not because they are unprofitable, but because they run out of cash. A company can be generating healthy profits on paper while simultaneously unable to pay its suppliers or make payroll. The 13-week cash flow forecast is the single most effective tool to prevent that from happening.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">What Is a 13-Week Cash Flow Forecast — and Why 13 Weeks?</h2>
          <p>
            A 13-week cash flow forecast is a rolling, week-by-week projection of every dollar coming into and going out of a business over the next quarter. The 13-week horizon is not arbitrary. It is short enough to forecast with reasonable accuracy, and long enough to give management meaningful lead time to act before a cash shortfall becomes a crisis.
          </p>
          <p>
            Lenders and restructuring advisors use 13-week forecasts as a standard tool during stressed situations precisely because they force operational specificity. Unlike annual budgets — which are often built top-down and divorced from actual cash timing — a 13-week forecast requires you to know when customers actually pay, when payroll runs, and when large bills land.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Profit Is Not Cash: The Critical Distinction</h2>
          <p>
            This is the most important concept in cash flow management, and it is widely misunderstood. Profit is an accounting construct. Cash is what sits in your bank account.
          </p>
          <p>
            When you invoice a customer for $50,000, your P&amp;L records $50,000 in revenue immediately. But if that customer pays on 60-day terms, you will not see that cash for two months. Meanwhile, you may have already paid your suppliers, your staff, and your rent to deliver that work. The timing gap between profit recognition and cash receipt is what kills businesses.
          </p>
          <p>
            A 13-week cash flow forecast ignores invoices and accruals entirely. It captures only actual cash movements: when money hits your bank, and when it leaves.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">How to Build a 13-Week Cash Flow Forecast</h2>
          <p>
            The structure is straightforward. Each column represents one week. Each row represents a line of cash inflow or outflow. Here are the core components:
          </p>

          <p className="text-white font-medium">Opening Balance</p>
          <p>
            Start with the actual cash balance in your bank account at the beginning of each week. Week 1 opening balance is your current cash position today. Every subsequent week&apos;s opening balance equals the prior week&apos;s closing balance.
          </p>

          <p className="text-white font-medium">Cash Inflows</p>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Customer receipts — based on actual payment terms (30, 60, 90 days), not invoice dates",
              "Loan proceeds or equity investment — if and when they are expected to land",
              "Asset sale proceeds — from equipment, property, or other disposals",
              "Tax refunds or government grants — on the date they are expected to be received",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <p className="text-white font-medium">Cash Outflows</p>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Payroll — exact dates and gross amounts including employer taxes",
              "Supplier payments — mapped to your actual payment run dates, not invoice dates",
              "Rent and utilities — on the days they are debited",
              "Loan repayments and interest — fixed schedule",
              "Tax payments — VAT, corporation tax, payroll taxes on their due dates",
              "Capital expenditure — equipment, software, or leasehold improvements",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <p className="text-white font-medium">Net Cash and Closing Balance</p>
          <p>
            Net cash for each week = total inflows minus total outflows. Closing balance = opening balance plus net cash. The closing balance becomes next week&apos;s opening balance. Any week where the closing balance goes negative is a problem that needs immediate attention.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">How to Use the Forecast Effectively</h2>
          <p>
            Building the forecast is only half the work. Update it every week by replacing projections with actuals for the week just completed, extending the horizon by one more week, and reviewing what changed and why. The weekly review forces accountability and surfaces surprises early.
          </p>
          <p>
            When you identify a week with a projected negative balance, you have options: chase receivables earlier, negotiate extended supplier terms, delay a capital purchase, or draw on a revolving credit facility. The earlier you see the problem, the more options you have. A 13-week forecast gives you up to three months of runway to act.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Common Mistakes to Avoid</h2>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Confusing invoice dates with receipt dates — always use expected payment dates based on actual customer behaviour",
              "Treating the forecast as a one-time exercise — it must roll forward every week to be useful",
              "Ignoring one-off or irregular outflows — annual insurance premiums, quarterly tax payments, and bonus runs catch businesses off guard",
              "Being overly optimistic about customer receipts — if a customer has a history of paying late, model them as paying late",
              "Not separating operating cash from financing cash — keep loan drawdowns and repayments clearly labelled",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">Who Needs a 13-Week Cash Flow Forecast?</h2>
          <p>
            The honest answer is: any business that cares about staying solvent. But it is especially critical for:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Business Type</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Why It Matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ["Seasonal businesses", "Revenue concentrates in certain months; costs continue year-round"],
                  ["Startups", "Burn rate management is existential; runway visibility is critical for fundraising"],
                  ["Project-based businesses", "Large invoices paid late create dangerous cash gaps between projects"],
                  ["Businesses with long payment terms", "60-90 day receivables cycles create structural cash pressure"],
                  ["Businesses in growth mode", "Fast growth consumes cash — more stock, more staff, more receivables"],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <td className="py-3 pr-6 text-blue-300 font-medium">{a}</td>
                    <td className="py-3 text-gray-300">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            If your business has predictable, consistent cash flows and strong reserves, a 13-week forecast is still useful — but less urgent. For everyone else, it is not optional. It is the minimum standard of financial management.
          </p>

          <p>
            Start simple. A well-maintained spreadsheet beats a sophisticated model that nobody updates. The goal is visibility, not complexity.
          </p>

        </div>

        <div className="mt-14 bg-[#0d1426] border border-blue-700/40 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Try the Free 13-Week Cash Flow Forecast Tool</h3>
          <p className="text-gray-400 text-sm mb-6">Build your cash flow forecast in minutes — no spreadsheet setup required, no signup needed.</p>
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
