import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Finance Tools — FinancePlots",
  description:
    "11 free finance tools — stock analysis, portfolio review, break-even, financial model, cash flow forecast, DCF valuation and more. No signup required.",
  alternates: { canonical: "https://www.financeplots.com/tools" },
};

const STOCK_TOOLS = [
  {
    icon: "📊",
    name: "Portfolio Analysis",
    desc: "Upload your holdings and analyse returns, risk metrics and asset allocation.",
    href: "/tools/portfolio-analysis",
  },
  {
    icon: "📉",
    name: "Stock Comparison",
    desc: "Compare two tickers side by side — returns, volatility, drawdown and key ratios.",
    href: "/tools/stock-comparison",
  },
  {
    icon: "📈",
    name: "Stock Analysis",
    desc: "Price history, moving averages, volume and cumulative return for any ticker.",
    href: "/tools/stock-analysis",
  },
];

const FPA_TOOLS = [
  {
    icon: "⚖️",
    name: "Break-Even Analysis",
    desc: "Fixed costs, variable costs, contribution margin, break-even units and margin of safety.",
    href: "/tools/break-even",
  },
  {
    icon: "📈",
    name: "5-Year Financial Model",
    desc: "Project revenue, costs and profits over 5 years with full income statement and margin analysis.",
    href: "/tools/financial-model",
  },
  {
    icon: "💰",
    name: "Annual Budget",
    desc: "Monthly P&L with seasonality support, revenue growth and cost structure.",
    href: "/tools/annual-budget",
  },
  {
    icon: "💧",
    name: "13-Week Cash Flow Forecast",
    desc: "Rolling weekly cash forecast with inflows, outflows, closing balance and negative-week alerts.",
    href: "/tools/cash-flow",
  },
  {
    icon: "🏢",
    name: "Business Valuation",
    desc: "DCF, EV/EBITDA and P/E — three-method blended valuation with 5-year DCF breakdown.",
    href: "/tools/valuation",
  },
  {
    icon: "🏦",
    name: "Lending Calculator",
    desc: "Loan amortisation schedule and mortgage analysis with early repayment strategy.",
    href: "/tools/lending",
  },
  {
    icon: "💸",
    name: "Personal Budget",
    desc: "Monthly income, 8 expense categories, savings rate and spending breakdown.",
    href: "/tools/personal-budget",
  },
  {
    icon: "💹",
    name: "Compound Interest",
    desc: "See how initial capital and monthly contributions grow. Historical market benchmarks included.",
    href: "/tools/compound-interest",
  },
];

function ToolCard({ tool }: { tool: { icon: string; name: string; desc: string; href: string } }) {
  return (
    <Link
      href={tool.href}
      className="bg-[#0d1426] border border-gray-800 hover:border-blue-600/60 rounded-2xl p-6 transition group block"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-white font-bold text-base group-hover:text-blue-300 transition">
              {tool.name}
            </h2>
            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-semibold">
              Live
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
        </div>
      </div>
    </Link>
  );
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">
          Free tools
        </p>
        <h1 className="text-4xl font-extrabold text-center mb-3">
          Finance Tools
        </h1>
        <p className="text-gray-400 text-center mb-16">
          11 free tools. No signup. No install. Works instantly in your browser.
        </p>

        {/* Featured */}
        <div className="mb-12">
          <Link
            href="/tools/financial-planner"
            className="block bg-gradient-to-br from-blue-900/40 to-purple-900/20 border border-blue-700/40 hover:border-blue-500 rounded-2xl p-7 transition group"
          >
            <div className="flex items-start gap-5">
              <span className="text-5xl shrink-0">🗺️</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-white font-bold text-xl group-hover:text-blue-300 transition">Financial Journey Planner</h2>
                  <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">Featured</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                  A 4-step interactive guide — build your budget, calculate your debt, project your savings with compound interest, and set your asset allocation. Everything connected in one journey.
                </p>
                <div className="flex gap-6 mt-4 text-xs text-gray-500">
                  <span>💰 Budget</span>
                  <span>→</span>
                  <span>💳 Debt</span>
                  <span>→</span>
                  <span>📈 Compounding</span>
                  <span>→</span>
                  <span>🎯 Allocation</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stock & Market */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">📡</span>
            <div>
              <h2 className="text-white font-bold text-lg">Stock &amp; Market Tools</h2>
              <p className="text-gray-500 text-xs">Live market data powered by Yahoo Finance</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {STOCK_TOOLS.map(tool => <ToolCard key={tool.name} tool={tool} />)}
          </div>
        </div>

        {/* FP&A */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">🧮</span>
            <div>
              <h2 className="text-white font-bold text-lg">FP&amp;A &amp; Planning Tools</h2>
              <p className="text-gray-500 text-xs">Browser-native tools with PDF export — no server required</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {FPA_TOOLS.map(tool => <ToolCard key={tool.name} tool={tool} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
