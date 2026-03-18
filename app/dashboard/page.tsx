"use client";

import { useState } from "react";

const STREAMLIT_BASE = "https://humble-beauty-production-82c1.up.railway.app";

const CATEGORIES = [
  {
    id: "personal",
    label: "Personal",
    emoji: "👤",
    tools: [
      { id: "portfolio-analysis",  label: "Portfolio Analysis",  url: `${STREAMLIT_BASE}/Portfolio_Analysis?embed=true&embed_options=show_sidebar` },
      { id: "stock-analysis",      label: "Stock Analysis",      url: `${STREAMLIT_BASE}/Stock_Analysis?embed=true&embed_options=show_sidebar` },
      { id: "stock-comparison",    label: "Stock Comparison",    url: `${STREAMLIT_BASE}/Stock_Comparison?embed=true&embed_options=show_sidebar` },
      { id: "commodities",         label: "Commodities",         url: `${STREAMLIT_BASE}/Commodities?embed=true&embed_options=show_sidebar` },
      { id: "personal-budget",     label: "Personal Budget",     url: `${STREAMLIT_BASE}/Personal_Budget?embed=true&embed_options=show_sidebar` },
      { id: "lending",             label: "Mortgage & Loans",    url: `${STREAMLIT_BASE}/Lending?embed=true&embed_options=show_sidebar` },
    ],
  },
  {
    id: "professional",
    label: "Professional",
    emoji: "🏢",
    tools: [
      { id: "financial-model",     label: "Financial Model",     url: `${STREAMLIT_BASE}/Financial_Model?embed=true&embed_options=show_sidebar` },
      { id: "annual-budget",       label: "Annual Budget",       url: `${STREAMLIT_BASE}/Annual_Budget?embed=true&embed_options=show_sidebar` },
      { id: "cash-flow-forecast",  label: "Cash Flow Forecast",  url: `${STREAMLIT_BASE}/Cash_Flow_Forecast?embed=true&embed_options=show_sidebar` },
      { id: "break-even",          label: "Break-Even",          url: `${STREAMLIT_BASE}/Break_Even?embed=true&embed_options=show_sidebar` },
      { id: "valuation",           label: "Valuation (DCF)",     url: `${STREAMLIT_BASE}/Valuation?embed=true&embed_options=show_sidebar` },
    ],
  },
];

export default function DashboardPage() {
  const [activeCatId, setActiveCatId] = useState(CATEGORIES[0].id);
  const [activeToolId, setActiveToolId] = useState(CATEGORIES[0].tools[0].id);

  const activeCat  = CATEGORIES.find((c) => c.id === activeCatId)!;
  const activeTool = CATEGORIES.flatMap((c) => c.tools).find((t) => t.id === activeToolId)
    ?? activeCat.tools[0];

  function selectCategory(catId: string) {
    const cat = CATEGORIES.find((c) => c.id === catId)!;
    setActiveCatId(catId);
    setActiveToolId(cat.tools[0].id);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">

      {/* ── Top bar ── */}
      <header className="bg-[#0d1426] border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
        <a href="/" className="text-white font-bold text-lg tracking-tight">
          Finance<span className="text-blue-400">Plots</span>
        </a>
        <a href="/#contact" className="text-sm text-blue-400 hover:text-blue-300 transition">
          Request custom →
        </a>
      </header>

      {/* ── Body: sidebar + iframe ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-[#0d1426] border-r border-gray-800 flex flex-col py-4 overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-4">
              {/* Category header */}
              <button
                onClick={() => selectCategory(cat.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                  activeCatId === cat.id ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>

              {/* Tool list — always visible */}
              <ul className="mt-1">
                {cat.tools.map((tool) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => { setActiveCatId(cat.id); setActiveToolId(tool.id); }}
                      className={`w-full text-left px-5 py-2 text-sm rounded-lg mx-2 transition ${
                        activeToolId === tool.id
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                      style={{ width: "calc(100% - 16px)" }}
                    >
                      {tool.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* iframe */}
        <div className="flex-1 relative">
          <iframe
            key={activeTool.id}
            src={activeTool.url}
            className="w-full h-full absolute inset-0 border-0"
            style={{ minHeight: "calc(100vh - 65px)" }}
            allow="clipboard-write"
            title={activeTool.label}
          />
        </div>
      </div>
    </div>
  );
}
