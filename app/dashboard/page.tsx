"use client";

import { useState } from "react";

const STREAMLIT_BASE = "https://hepmp6yh.up.railway.app";

const TOOLS = [
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
    id: "lending",
    label: "Lending",
    url: `${STREAMLIT_BASE}/Lending?embed=true&embed_options=show_sidebar`,
  },
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
    id: "commodities",
    label: "Commodities",
    url: `${STREAMLIT_BASE}/Commodities?embed=true&embed_options=show_sidebar`,
  },
  {
    id: "stock-analysis",
    label: "Stock Analysis",
    url: `${STREAMLIT_BASE}/Stock_Analysis?embed=true&embed_options=show_sidebar`,
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
];

export default function DashboardPage() {
  const [active, setActive] = useState(TOOLS[0]);

  const iframeUrl = active.url;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#0d1426] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-white font-bold text-lg tracking-tight">
          Finance<span className="text-blue-400">Plots</span>
        </a>
        <nav className="flex gap-2 overflow-x-auto max-w-2xl">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(tool)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                active.id === tool.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tool.label}
            </button>
          ))}
        </nav>
        <a
          href="/#contact"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          Request custom →
        </a>
      </header>

      {/* iFrame */}
      <div className="flex-1 relative">
        <iframe
          src={iframeUrl}
          className="w-full h-full absolute inset-0 border-0"
          style={{ minHeight: "calc(100vh - 65px)" }}
          allow="clipboard-write"
          title={active.label}
        />
      </div>
    </div>
  );
}
