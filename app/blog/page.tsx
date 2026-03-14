import Link from "next/link";

const articles = [
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
    description: "Every month of runway is a month of optionality. How founders can think rigorously about burn rate and capital efficiency before the pressure is on.",
    tag: "Startup Finance",
  },
  {
    slug: "uk-pension-savings",
    title: "The UK Pension Puzzle: Why Starting Early Could Mean £200,000 More in Retirement",
    date: "March 2026",
    description: "How the UK tax system makes pension contributions one of the most efficient wealth-building tools available — and why most people underuse it.",
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

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-400 mb-12">Insights on dashboards, finance tools, and data analytics.</p>

        <div className="space-y-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="block bg-[#0d1426] border border-gray-700 hover:border-blue-500 rounded-xl p-6 transition"
            >
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{a.tag}</span>
              <h2 className="text-xl font-bold mt-2 mb-2">{a.title}</h2>
              <p className="text-gray-400 text-sm mb-3">{a.description}</p>
              <span className="text-gray-500 text-xs">{a.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
