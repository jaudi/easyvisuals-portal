import Link from "next/link";

const articles = [
  {
    slug: "personal-budget-guide",
    title: "How to Build a Personal Budget That Actually Works",
    date: "March 2026",
    description: "Most people try to budget and give up within a month. A simple, honest framework for taking control of your money — income, expenses, savings rate, and what to do first.",
    tag: "Personal Finance",
  },
  {
    slug: "cash-flow-forecast-guide",
    title: "The 13-Week Cash Flow Forecast: Why Every Business Needs One",
    date: "March 2026",
    description: "Profit and cash are not the same thing. A 13-week rolling cash forecast is the single most important tool for any business managing liquidity.",
    tag: "Corporate Finance",
  },
  {
    slug: "dcf-valuation-guide",
    title: "DCF Valuation Explained: How to Value a Business Using Discounted Cash Flow",
    date: "March 2026",
    description: "The gold standard for business valuation — how to build a DCF model, choose a discount rate, and interpret the output correctly.",
    tag: "Valuation",
  },
  {
    slug: "break-even-analysis-guide",
    title: "Break-Even Analysis: The First Financial Calculation Every Business Owner Should Know",
    date: "March 2026",
    description: "Fixed costs, variable costs, contribution margin, margin of safety — and why every pricing decision should start here.",
    tag: "Small Business Finance",
  },
  {
    slug: "investment-portfolio-analysis",
    title: "How to Analyse Your Investment Portfolio: Return, Risk and Diversification",
    date: "March 2026",
    description: "Most investors track returns. The best investors track risk-adjusted returns. Here's what to measure and why.",
    tag: "Personal Finance",
  },
  {
    slug: "5-year-financial-model",
    title: "How to Build a 5-Year Financial Model for Your Business",
    date: "March 2026",
    description: "Investors and banks ask for 5-year projections. Here's how to build a three-statement model that actually holds up under scrutiny.",
    tag: "Corporate Finance",
  },
  {
    slug: "annual-budget-guide",
    title: "How to Build an Annual Budget That Your Finance Team Will Actually Use",
    date: "March 2026",
    description: "Most company budgets fail because they're set once and never revisited. Here's how to build one that drives real decisions.",
    tag: "Corporate Finance",
  },
  {
    slug: "financial-forecasting",
    title: "Why Financial Forecasting Is the Most Underused Tool in Business",
    date: "March 2026",
    description: "Most businesses react to numbers. The best ones anticipate them. Here's why forecasting is the foundation of every sound business decision.",
    tag: "Corporate Finance",
  },
  {
    slug: "bootstrapping-runway",
    title: "Bootstrapping & Runway: How to Extend Your Startup's Life Without Giving Up Equity",
    date: "March 2026",
    description: "Every month of runway is a month of optionality. How founders can think rigorously about burn rate and capital efficiency.",
    tag: "Startup Finance",
  },
  {
    slug: "uk-pension-savings",
    title: "The UK Pension Puzzle: Why Starting Early Could Mean £200,000 More in Retirement",
    date: "March 2026",
    description: "How the UK tax system makes pension contributions one of the most efficient wealth-building tools available.",
    tag: "Personal Finance",
  },
  {
    slug: "powerbi-vs-streamlit",
    title: "Power BI vs Streamlit: Which One Is Right for Your Finance Team?",
    date: "March 2026",
    description: "An honest comparison of two popular analytics tools — pros, cons, and when to use each.",
    tag: "Analysis",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Corporate Finance": "text-blue-400",
  "Valuation": "text-purple-400",
  "Small Business Finance": "text-yellow-400",
  "Personal Finance": "text-green-400",
  "Startup Finance": "text-orange-400",
  "Analysis": "text-gray-400",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-400 mb-12">
          FP&amp;A guides for individuals, finance teams, and wealth managers.
        </p>

        <div className="space-y-4">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="block bg-[#0d1426] border border-gray-700 hover:border-blue-500 rounded-xl p-6 transition"
            >
              <span className={`text-xs font-semibold uppercase tracking-wider ${TAG_COLORS[a.tag] ?? "text-blue-400"}`}>
                {a.tag}
              </span>
              <h2 className="text-xl font-bold mt-2 mb-2 leading-snug">{a.title}</h2>
              <p className="text-gray-400 text-sm mb-3">{a.description}</p>
              <span className="text-gray-500 text-xs">{a.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
