import Link from "next/link";

export default function FiveYearFinancialModel() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 transition mb-8 inline-block">
          ← Back to Blog
        </Link>

        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Corporate Finance</span>
        <h1 className="text-4xl font-bold mt-2 mb-3 leading-tight">
          How to Build a 5-Year Financial Model for Your Business
        </h1>
        <p className="text-gray-400 text-sm mb-10">March 2026 · 8 min read</p>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-6">

          <p>
            When an investor or bank asks for a 5-year financial model, they are not asking because they believe the projections will be accurate. They know they will not be. What they are evaluating is whether you understand your own business well enough to model it — the revenue drivers, the cost structure, the capital requirements, and how the three financial statements interact. The model is a test of financial literacy and operational understanding as much as it is a forecast.
          </p>
          <p>
            This guide walks through how to build a credible, investor-ready 5-year model from scratch.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Why Investors and Banks Require 5-Year Projections</h2>
          <p>
            Five years is long enough to show a business reaching maturity or meaningful scale, but short enough that assumptions can be tied to observable market data and operational plans. It is also the typical investment horizon for venture capital and private equity. For banks, 5-year projections demonstrate that the business can service debt over the loan term. For equity investors, it provides the basis for a DCF valuation.
          </p>
          <p>
            A 5-year model signals to any counterparty that you are running your business with intention — that you have thought through how revenue will grow, where costs will increase, and how much cash the business will need along the way.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">The Three Statement Model: How They Link</h2>
          <p>
            A complete financial model integrates three statements that are mechanically connected. You cannot change one without the others updating — and that integration is what makes the model useful rather than decorative.
          </p>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Profit & Loss (P&L): shows revenue, costs, and profitability over the period. EBITDA and net profit live here.",
              "Cash Flow Statement: starts with net profit from the P&L, adjusts for non-cash items (depreciation, amortisation), and accounts for working capital movements and capex to arrive at free cash flow.",
              "Balance Sheet: shows assets, liabilities, and equity at a point in time. Net profit from the P&L flows into retained earnings; cash from the cash flow statement feeds into the cash balance.",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>
          <p>
            The balance sheet is the ultimate check: if it does not balance (assets = liabilities + equity), there is an error somewhere in the model. Building the three-statement model teaches you where every number comes from and where it goes.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Revenue Drivers: Bottom-Up vs Top-Down</h2>
          <p>
            There are two broad approaches to revenue forecasting. Both are valid in different contexts, and the best models often use both as a cross-check.
          </p>
          <p>
            <span className="text-white font-medium">Top-down:</span> Start with the total addressable market (TAM) and apply a market share assumption. If the UK payroll software market is $500m and you expect to capture 0.5% in year 3, that is $2.5m in revenue. This approach is useful for showing the market opportunity, but it can be gamed easily — a small change in market share assumption has a large impact on the output.
          </p>
          <p>
            <span className="text-white font-medium">Bottom-up:</span> Build revenue from operational units — number of salespeople, number of customers, average contract value, churn rate. For a SaaS business: (number of customers × average monthly recurring revenue) × 12 = annual revenue. This is harder to build but far more credible, because every assumption is grounded in something operational.
          </p>
          <p>
            For years 1 and 2, use bottom-up. For years 3 to 5, you can use a growth rate applied to the bottom-up base, sanity-checked against the top-down market share this implies.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Cost Structure: From Revenue to EBITDA</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Line Item</th>
                  <th className="text-left py-3 text-gray-400 font-medium">What It Captures</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ["Revenue", "Total sales across all products and segments"],
                  ["Cost of Goods Sold (COGS)", "Direct costs to deliver the product or service — hosting, materials, direct labour"],
                  ["Gross Profit", "Revenue minus COGS. Gross margin % is a key benchmark for your industry"],
                  ["Operating Expenses (OpEx)", "Sales & marketing, R&D, general & administrative costs — the overhead of running the business"],
                  ["EBITDA", "Earnings before interest, tax, depreciation & amortisation. The primary profitability metric for most models"],
                  ["Depreciation & Amortisation", "Non-cash charge for the wear of assets — reduces profit but not cash"],
                  ["EBIT / Operating Profit", "EBITDA minus D&A"],
                  ["Interest & Tax", "Financing costs and tax charge"],
                  ["Net Profit", "The bottom line — what flows into retained earnings on the balance sheet"],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <td className="py-3 pr-6 text-blue-300 font-medium">{a}</td>
                    <td className="py-3 text-gray-300">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-white mt-8">Key Ratios to Include in the Model</h2>
          <p>
            Every investor will calculate these ratios from your model. Present them explicitly — it shows you understand what they are looking for.
          </p>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Gross margin %: gross profit as a percentage of revenue. SaaS businesses typically target 70–80%; manufacturing businesses 30–50%",
              "EBITDA margin %: EBITDA as a percentage of revenue. Shows operating leverage — how profitability scales with revenue growth",
              "Revenue growth rate: year-on-year percentage change, should follow a credible trajectory",
              "Cash conversion: how much of EBITDA converts to actual free cash flow after capex and working capital",
              "Burn rate and runway (for pre-profitability businesses): monthly cash consumption and months of cash remaining",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">Common Mistakes That Undermine Credibility</h2>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Straight-line revenue growth: assuming 20% growth every year with no variation signals a lack of understanding of business cycles and sales dynamics",
              "Ignoring working capital: as revenue grows, so does the cash tied up in receivables and inventory — models that ignore this overstate cash generation significantly",
              "No sensitivity analysis: presenting a single scenario without showing what happens if revenue is 20% lower or costs are 15% higher suggests fragile assumptions",
              "Underestimating headcount costs: staff costs including benefits, employer taxes, and recruitment fees routinely exceed base salary estimates by 25–30%",
              "Disconnected statements: a model where the three statements do not mechanically link is immediately apparent to any experienced reviewer",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">What to Include When Presenting to Investors</h2>
          <p>
            The model itself should be accompanied by a clear narrative. Investors want to understand the key assumptions driving each revenue line, what the proceeds of investment will be used for and when, what milestones will be hit at each stage of the plan, and what the model looks like under a downside scenario.
          </p>
          <p>
            Present three scenarios: base case, upside (15–20% above base revenue), and downside (20–25% below base revenue). Show that the business survives the downside case — investors are risk managers as much as return seekers, and demonstrating resilience is as important as demonstrating ambition.
          </p>
          <p>
            A strong 5-year model is not a prediction. It is a structured expression of your business logic — how revenue is earned, how costs are managed, and how cash flows through the business. Get that right, and the numbers become a starting point for a credible conversation.
          </p>

        </div>

        <div className="mt-14 bg-[#0d1426] border border-blue-700/40 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Build Your 5-Year Financial Model Free</h3>
          <p className="text-gray-400 text-sm mb-6">Input your revenue drivers and cost assumptions — get a fully integrated P&amp;L, cash flow, and key ratio output instantly.</p>
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
