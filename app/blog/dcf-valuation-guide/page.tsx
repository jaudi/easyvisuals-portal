import Link from "next/link";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "DCF Valuation Explained: How to Value a Business Using Discounted Cash Flow | FinancePlots",
  description: "The gold standard for business valuation explained clearly — free cash flows, WACC, terminal value, and how to interpret the output.",
  openGraph: {
    title: "DCF Valuation Explained: How to Value a Business Using Discounted Cash Flow",
    description: "The gold standard for business valuation explained clearly — free cash flows, WACC, terminal value, and how to interpret the output.",
    url: "https://www.financeplots.com/blog/dcf-valuation-guide",
    siteName: "FinancePlots",
    type: "article",
    images: [{ url: "https://www.financeplots.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DCF Valuation Explained: How to Value a Business Using Discounted Cash Flow",
    description: "The gold standard for business valuation explained clearly — free cash flows, WACC, terminal value, and how to interpret the output.",
    images: ["https://www.financeplots.com/og-image.png"],
  },
};

export default function DcfValuationGuide() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 transition mb-8 inline-block">
          ← Back to Blog
        </Link>

        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Valuation</span>
        <h1 className="text-4xl font-bold mt-2 mb-3 leading-tight">
          DCF Valuation Explained: How to Value a Business Using Discounted Cash Flow
        </h1>
        <p className="text-gray-400 text-sm mb-10">March 2026 · 8 min read</p>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-6">

          <p>
            Discounted cash flow analysis — DCF — is the closest thing finance has to a universal truth. Strip away the market noise, the comparable transactions, and the industry multiples, and what you are left with is a fundamental question: how much is a stream of future cash flows worth today? That is what DCF answers. It is the gold standard for business valuation, taught in every MBA program and used by every serious M&amp;A advisor, investor, and corporate finance team.
          </p>
          <p>
            Understanding DCF is not just an academic exercise. If you are raising capital, selling a business, acquiring a competitor, or evaluating a major investment, you need to be able to build a DCF model — or at minimum, critically interrogate one that someone else has built.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">The Core Principle: Money Today Is Worth More Than Money Tomorrow</h2>
          <p>
            A dollar received today is worth more than a dollar received in five years. This is not just intuition — it reflects the real cost of waiting: inflation erodes purchasing power, there is always a risk the payment does not materialise, and money in hand today can be invested to generate returns. The rate at which future cash is discounted back to today is called the discount rate. The higher the risk, the higher the discount rate, and the less a future cash flow is worth in today&apos;s terms.
          </p>
          <p>
            The present value of a single future cash flow is calculated as:
          </p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg px-6 py-4 font-mono text-blue-300 text-sm">
            PV = FCF ÷ (1 + r)^t
          </div>
          <p>
            Where FCF is the free cash flow in year t, r is the discount rate, and t is the number of years into the future. A DCF sums this calculation across every year of the forecast period, then adds the terminal value.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Step 1: Forecast Free Cash Flows</h2>
          <p>
            Free cash flow (FCF) is the cash a business generates after accounting for operating costs and capital expenditure — the cash that is genuinely available to investors. It is calculated as:
          </p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg px-6 py-4 font-mono text-blue-300 text-sm">
            FCF = EBIT × (1 − tax rate) + Depreciation − Capital Expenditure − Change in Working Capital
          </div>
          <p>
            Forecasting FCF typically covers 5 to 10 years, depending on how far out you can make reasonable assumptions. Year 1 and 2 projections should be grounded in detailed operational assumptions — specific revenue contracts, known cost increases, planned capex. Years 3 to 5 will necessarily involve more judgment.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Step 2: Choose a Discount Rate (WACC)</h2>
          <p>
            The most commonly used discount rate in a corporate DCF is the Weighted Average Cost of Capital (WACC). WACC reflects the blended cost of all capital used to fund the business — both debt and equity — weighted by their proportion in the capital structure.
          </p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg px-6 py-4 font-mono text-blue-300 text-sm">
            WACC = (E/V × Ke) + (D/V × Kd × (1 − tax rate))
          </div>
          <p>
            Where E is the market value of equity, D is the market value of debt, V is total firm value (E + D), Ke is the cost of equity (typically estimated using the Capital Asset Pricing Model), and Kd is the cost of debt (the interest rate on borrowings). The tax shield on debt interest reduces the effective cost of debt, which is why debt financing is often cheaper than equity.
          </p>
          <p>
            For most private companies, WACC falls somewhere between 8% and 20%, depending on the risk profile of the business. Early-stage companies with uncertain cash flows will carry a much higher WACC than a stable, asset-heavy infrastructure business.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Step 3: Calculate Terminal Value</h2>
          <p>
            The forecast period — say 5 years — only captures a fraction of the business&apos;s total value. Most of a business&apos;s value lies beyond the explicit forecast horizon. Terminal value captures this. The most widely used approach is the Gordon Growth Model:
          </p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg px-6 py-4 font-mono text-blue-300 text-sm">
            Terminal Value = FCF in final year × (1 + g) ÷ (WACC − g)
          </div>
          <p>
            Where g is the long-term sustainable growth rate — typically set at or below the long-run nominal GDP growth rate (2–3% for most developed economies). Assuming a growth rate above that is aggressive and rarely defensible.
          </p>
          <p>
            The terminal value is then discounted back to today using the same WACC. In many DCF models, the terminal value represents 60–80% of total enterprise value — which is why the assumed growth rate and discount rate are so consequential.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Step 4: Sum to Get Enterprise Value</h2>
          <p>
            Enterprise value (EV) is the sum of all discounted free cash flows across the forecast period plus the discounted terminal value. To get from enterprise value to equity value, subtract net debt (total debt minus cash and cash equivalents). The result is what the equity of the business is theoretically worth.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Sensitivity Analysis: The Output Is a Range, Not a Number</h2>
          <p>
            Anyone who presents a DCF with a single output number is either naive or trying to mislead you. The output of a DCF is deeply sensitive to the discount rate and the terminal growth rate. A one-percentage-point change in either assumption can move the valuation by 20–40% or more.
          </p>
          <p>
            Best practice is to present a sensitivity table showing enterprise value under a range of WACC and growth rate combinations. This gives a valuation range rather than a false-precision point estimate, which is a far more honest representation of what a DCF can tell you.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Limitations: Garbage In, Garbage Out</h2>
          <ul className="space-y-2 list-none pl-0">
            {[
              "DCF is only as good as the cash flow forecasts that feed it — overly optimistic revenue projections produce inflated valuations",
              "WACC is estimated, not observed — different analysts will arrive at different discount rates for the same business",
              "Terminal value dominates total value, meaning small changes in long-term assumptions have an outsized impact on the output",
              "DCF does not capture optionality, strategic synergies, or market sentiment — which is why it is often used alongside market multiples",
              "Private company DCFs are harder — there is no market beta to observe, and capital structure assumptions are less stable",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">When to Use a DCF</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Situation</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Why DCF Is Appropriate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ["M&A due diligence", "Assessing whether the target price is justified by fundamentals"],
                  ["Equity fundraising", "Anchoring a pre-money valuation in investor negotiations"],
                  ["Capital budgeting", "Evaluating whether a major investment generates adequate returns"],
                  ["Business sale", "Understanding intrinsic value before engaging buyers"],
                  ["Fairness opinions", "Providing an independent view on transaction pricing"],
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
            DCF is not suited for businesses with no visible path to positive cash flow, where comparable market data is abundant and reliable, or where asset-based valuation is more appropriate (e.g., holding companies or real estate). But for the vast majority of operating businesses, it remains the most rigorous and defensible valuation methodology available.
          </p>

        </div>

        <ShareButtons
          url="https://www.financeplots.com/blog/dcf-valuation-guide"
          title="DCF Valuation Explained: How to Value a Business Using Discounted Cash Flow"
        />

        <div className="mt-14 bg-[#0d1426] border border-blue-700/40 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Try the Free DCF Valuation Tool</h3>
          <p className="text-gray-400 text-sm mb-6">Input your cash flow projections and discount rate — get a full DCF output with sensitivity table in seconds.</p>
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
