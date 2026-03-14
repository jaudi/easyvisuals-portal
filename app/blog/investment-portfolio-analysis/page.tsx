import Link from "next/link";

export default function InvestmentPortfolioAnalysis() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <Link href="/blog" className="text-blue-400 text-sm hover:text-blue-300 transition mb-8 inline-block">
          ← Back to Blog
        </Link>

        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Personal Finance</span>
        <h1 className="text-4xl font-bold mt-2 mb-3 leading-tight">
          How to Analyse Your Investment Portfolio: Return, Risk and Diversification
        </h1>
        <p className="text-gray-400 text-sm mb-10">March 2026 · 7 min read</p>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-6">

          <p>
            Most investors check their portfolio by looking at one number: total return. Is it up or down? By how much? While return matters, focusing on return alone is like evaluating a car purely by its top speed without considering fuel consumption, handling, or braking distance. A rigorous portfolio analysis requires understanding both what you earned and what risk you took to earn it — and whether the two are in proportion.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Total Return vs Annualised Return</h2>
          <p>
            Total return measures the overall gain or loss on an investment from purchase to the current date, expressed as a percentage of the initial investment. It includes both price appreciation and any income received (dividends, coupons). Simple enough.
          </p>
          <p>
            Annualised return — also called the Compound Annual Growth Rate (CAGR) — is more useful for comparing investments held over different time periods. A 60% total return over 10 years is substantially less impressive than a 60% total return over 3 years. CAGR normalises for time:
          </p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg px-6 py-4 font-mono text-blue-300 text-sm">
            CAGR = (Ending Value ÷ Beginning Value)^(1 ÷ Years) − 1
          </div>
          <p>
            When evaluating fund managers, comparing portfolios, or setting return expectations, always use annualised figures. Total return without a time dimension tells you very little.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Volatility: The Most Underappreciated Risk Measure</h2>
          <p>
            Risk, in a quantitative sense, is typically measured by volatility — specifically the standard deviation of returns. A portfolio that returns 10% per year, every year, is very different from one that returns +40% one year and −20% the next, even if the average return is identical. The second portfolio requires you to hold on through gut-wrenching drawdowns, and many investors cannot — or do not.
          </p>
          <p>
            Annualised volatility is calculated from daily or monthly return data:
          </p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg px-6 py-4 font-mono text-blue-300 text-sm">
            Annualised Volatility = StdDev(monthly returns) × √12
          </div>
          <p>
            A portfolio with annualised volatility of 8% is relatively stable (think a balanced multi-asset fund). A portfolio with volatility of 30% is extremely turbulent (think a concentrated equity portfolio or a crypto allocation). Understanding your portfolio&apos;s volatility helps you set realistic expectations and size positions appropriately for your risk tolerance.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">The Sharpe Ratio: Return per Unit of Risk</h2>
          <p>
            The Sharpe ratio is one of the most widely used metrics in professional portfolio management. It measures how much excess return you are earning per unit of volatility taken on — in other words, how efficiently your portfolio is converting risk into return.
          </p>
          <div className="bg-[#0d1426] border border-gray-700 rounded-lg px-6 py-4 font-mono text-blue-300 text-sm">
            Sharpe Ratio = (Portfolio Return − Risk-Free Rate) ÷ Portfolio Volatility
          </div>
          <p>
            The risk-free rate is typically the current yield on short-term government bonds (e.g., US 3-month T-bills). A Sharpe ratio above 1.0 is generally considered good. Above 2.0 is exceptional. A portfolio with a Sharpe of 0.3 is generating very little return relative to the volatility you are experiencing.
          </p>
          <p>
            The Sharpe ratio is particularly useful for comparing two portfolios with different return profiles. A portfolio returning 15% with a Sharpe of 0.6 is delivering less risk-adjusted performance than one returning 10% with a Sharpe of 1.2. The numbers alone do not tell that story — the ratio does.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Diversification: Correlation Is Everything</h2>
          <p>
            The whole point of diversification is to hold assets that do not all move in the same direction at the same time. When one falls, another holds steady or rises. This reduces portfolio volatility without necessarily reducing expected return — which is why diversification is sometimes called the only free lunch in finance.
          </p>
          <p>
            Correlation measures how closely two assets move together, on a scale from −1 (perfectly opposite) to +1 (perfectly in sync). A portfolio of 10 stocks that are all highly correlated with each other — say, 10 US tech stocks — provides almost no real diversification. You might as well hold one. A portfolio mixing global equities, bonds, commodities, and real assets with lower inter-correlations provides meaningful risk reduction.
          </p>
          <p>
            Common correlation patterns worth knowing:
          </p>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Equities and government bonds: historically low or negative correlation — bonds rise when equities fall (though this broke down in 2022)",
              "Gold and equities: low correlation, particularly in risk-off environments — gold often holds value when markets sell off",
              "Real estate and equities: moderate positive correlation, more so during financial crises",
              "Crypto and equities: increasingly positive correlation as institutional participation has grown",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">Asset Allocation: The Decision That Drives Most of Your Return</h2>
          <p>
            Research consistently shows that asset allocation — the mix between equities, bonds, cash, and alternatives — explains the majority of portfolio return variation over time. Security selection matters at the margin. Asset allocation matters structurally.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Asset Class</th>
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Expected Return</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Expected Volatility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ["Global Equities", "7–10% p.a.", "15–20%"],
                  ["Government Bonds", "3–5% p.a.", "5–8%"],
                  ["Corporate Bonds", "4–6% p.a.", "6–10%"],
                  ["Commodities", "3–6% p.a.", "15–25%"],
                  ["Cash", "3–5% p.a.", "~0%"],
                ].map(([a, b, c]) => (
                  <tr key={a}>
                    <td className="py-3 pr-6 text-blue-300 font-medium">{a}</td>
                    <td className="py-3 pr-6 text-gray-300">{b}</td>
                    <td className="py-3 text-gray-300">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500">Long-run estimates. Actual returns will vary. Not a guarantee of future performance.</p>

          <h2 className="text-xl font-semibold text-white mt-8">How to Rebalance — and Why</h2>
          <p>
            Over time, assets that have performed well will grow to represent a larger share of your portfolio than intended. A portfolio originally set at 70% equities and 30% bonds may drift to 85/15 after a strong equity bull market. Rebalancing means selling assets that have grown beyond their target weight and buying those that have fallen below — systematically buying low and selling high.
          </p>
          <p>
            Most investors rebalance either on a calendar schedule (annually or semi-annually) or when an asset class drifts beyond a threshold (e.g., more than 5 percentage points from its target). Rebalancing too frequently incurs unnecessary transaction costs. Never rebalancing means your risk profile drifts away from what you intended.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">Common Mistakes That Erode Returns</h2>
          <ul className="space-y-2 list-none pl-0">
            {[
              "Overconcentration: holding more than 10–15% of a portfolio in a single stock or sector without a deliberate reason",
              "Home bias: systematically overweighting your own country's market, missing global diversification",
              "Ignoring fees: a 1% annual fee sounds trivial but compounds to a 26% reduction in wealth over 30 years",
              "Chasing recent performance: rotating into assets after they have already run up, buying high and selling low in reverse",
              "Neglecting rebalancing: letting winners drift to excessive weightings, increasing risk beyond your intended level",
              "Confusing activity with management: frequent trading is not portfolio management — it is usually performance-destructive noise",
            ].map((item) => (
              <li key={item} className="flex gap-2"><span className="text-blue-400">→</span>{item}</li>
            ))}
          </ul>

          <p>
            Good portfolio analysis does not require sophisticated software. It requires consistent measurement of return and risk, honest assessment of whether your allocation still reflects your goals and time horizon, and the discipline to rebalance rather than react. Those three habits — consistently applied — outperform almost any tactical strategy over the long run.
          </p>

        </div>

        <div className="mt-14 bg-[#0d1426] border border-blue-700/40 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Analyse Your Portfolio Free — No Signup</h3>
          <p className="text-gray-400 text-sm mb-6">Enter your holdings and get return, volatility, Sharpe ratio, and allocation breakdown instantly.</p>
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
