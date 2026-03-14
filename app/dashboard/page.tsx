"use client";

import { useState } from "react";

const STREAMLIT_BASE = "https://finance-tools-i4jfj2y88rs9r4hpquligl.streamlit.app";

const TOOL_CATEGORIES = [
  {
    label: "Personal",
    emoji: "👤",
    tools: [
      {
        id: "portfolio-analysis",
        label: "Portfolio Analysis",
        url: `${STREAMLIT_BASE}/Portfolio_Analysis?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "stock-comparison",
        label: "Stock Comparison",
        url: `${STREAMLIT_BASE}/Stock_Comparison?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "stock-analysis",
        label: "Stock Analysis",
        url: `${STREAMLIT_BASE}/Stock_Analysis?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "commodities",
        label: "Commodities",
        url: `${STREAMLIT_BASE}/Commodities?embed=true&embed_options=show_sidebar`,
      },
    ],
  },
  {
    label: "Professional",
    emoji: "🏢",
    tools: [
      {
        id: "financial-model",
        label: "Financial Model",
        url: `${STREAMLIT_BASE}/Financial_Model?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "annual-budget",
        label: "Annual Budget",
        url: `${STREAMLIT_BASE}/Annual_Budget?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "cash-flow-forecast",
        label: "Cash Flow Forecast",
        url: `${STREAMLIT_BASE}/Cash_Flow_Forecast?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "break-even",
        label: "Break-Even",
        url: `${STREAMLIT_BASE}/Break_Even?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "valuation",
        label: "Valuation",
        url: `${STREAMLIT_BASE}/Valuation?embed=true&embed_options=show_sidebar`,
      },
      {
        id: "lending",
        label: "Lending",
        url: `${STREAMLIT_BASE}/Lending?embed=true&embed_options=show_sidebar`,
      },
    ],
  },
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap((c) => c.tools);

export default function DashboardPage() {
  const [active, setActive] = useState(ALL_TOOLS[0]);
  const [activeCategory, setActiveCategory] = useState(TOOL_CATEGORIES[0].label);

  const currentCategory = TOOL_CATEGORIES.find((c) => c.label === activeCategory)!;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#0d1426] border-b border-gray-800 px-6 py-0 flex items-stretch justify-between">
        <a href="/" className="text-white font-bold text-lg tracking-tight flex items-center pr-6 border-r border-gray-800">
          Finance<span className="text-blue-400">Plots</span>
        </a>

        {/* Category + Tool nav */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Category tabs */}
          <div className="flex gap-0 border-b border-gray-800/60">
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  setActiveCategory(cat.label);
                  setActive(cat.tools[0]);
                }}
                className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
                  activeCategory === cat.label
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          {/* Tool tabs */}
          <div className="flex gap-1 px-2 py-2 overflow-x-auto">
            {currentCategory.tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActive(tool)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  active.id === tool.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>
        </div>

        <a
          href="/#contact"
          className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center pl-6 border-l border-gray-800 whitespace-nowrap"
        >
          Request custom →
        </a>
      </header>

      {/* iFrame */}
      <div className="flex-1 relative">
        <iframe
          src={active.url}
          className="w-full h-full absolute inset-0 border-0"
          style={{ minHeight: "calc(100vh - 85px)" }}
          allow="clipboard-write"
          title={active.label}
        />
      </div>
    </div>
  );
}
