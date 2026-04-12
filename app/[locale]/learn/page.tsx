import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn — Power BI & Streamlit for Finance Professionals | FinancePlots",
  description:
    "Interactive lessons on Power BI (Power Query, Modelling, Visuals) and Streamlit for Python. 80 lessons with simulators, code examples and quizzes.",
  alternates: { canonical: "https://www.financeplots.com/learn" },
};

const TRACKS = [
  {
    href: "/learn/power-bi",
    icon: "🟡",
    label: "Power BI",
    tagline: "Master the professional analytics platform",
    color: "from-yellow-600/20 to-yellow-500/5 border-yellow-500/30",
    accent: "text-yellow-400",
    badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    modules: [
      { icon: "🔄", name: "Power Query", count: 10, desc: "M code, transforms, merges, unpivot" },
      { icon: "🧮", name: "Modelling",   count: 10, desc: "DAX, star schema, CALCULATE, time intelligence" },
      { icon: "📊", name: "Visuals",     count: 10, desc: "Charts, matrix, slicers, design principles" },
      { icon: "⚙️", name: "Other",       count: 10, desc: "RLS, pipelines, performance, embedding" },
    ],
  },
  {
    href: "/learn/streamlit",
    icon: "🔴",
    label: "Streamlit",
    tagline: "Build finance apps with Python in hours",
    color: "from-red-600/20 to-red-500/5 border-red-500/30",
    accent: "text-red-400",
    badge: "bg-red-500/10 text-red-300 border-red-500/20",
    modules: [
      { icon: "🧱", name: "Basics",      count: 10, desc: "Widgets, layouts, session state, caching" },
      { icon: "📈", name: "Charts",      count: 10, desc: "Plotly, Altair, Matplotlib, st.metric" },
      { icon: "🗄️", name: "Data",        count: 10, desc: "Pandas, APIs, Excel, exports, validation" },
      { icon: "🚀", name: "Deployment",  count: 10, desc: "Railway, Docker, secrets, CI/CD" },
    ],
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">
            FinancePlots Academy
          </p>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Learn Plots for<br />
            <span className="text-blue-400">Finance Professionals</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Two structured tracks — Power BI and Streamlit. Each with interactive simulators,
            real code, and quizzes. Built for finance directors, analysts and FP&A teams.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">80</span> lessons</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span className="flex items-center gap-2"><span className="text-green-400 font-bold">2</span> tracks</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>Free forever</span>
          </div>
        </div>

        {/* Tracks */}
        <div className="grid md:grid-cols-2 gap-8">
          {TRACKS.map(track => (
            <Link
              key={track.href}
              href={track.href}
              className={`group block bg-gradient-to-br ${track.color} border rounded-3xl p-8 hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{track.icon}</span>
                <div>
                  <h2 className={`text-2xl font-extrabold ${track.accent}`}>{track.label}</h2>
                  <p className="text-gray-400 text-sm">{track.tagline}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {track.modules.map(mod => (
                  <div key={mod.name} className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{mod.icon}</span>
                      <span className="font-semibold text-sm text-white">{mod.name}</span>
                      <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full border ${track.badge}`}>{mod.count}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-snug">{mod.desc}</p>
                  </div>
                ))}
              </div>

              <div className={`mt-6 flex items-center gap-2 text-sm font-semibold ${track.accent} group-hover:gap-3 transition-all`}>
                Start learning
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Why Learn Here */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Simulator-first", desc: "Every lesson shows live code, before/after data transformations and rendered outputs — not just slides." },
            { icon: "🎯", title: "Finance-focused", desc: "All examples use finance datasets: sales data, P&L tables, stock prices, budget models." },
            { icon: "🧠", title: "Lesson quizzes", desc: "Each lesson ends with a quiz question. Lock in knowledge before moving to the next concept." },
          ].map(f => (
            <div key={f.title} className="bg-white/[0.03] border border-gray-800 rounded-2xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
