"use client";

import Link from "next/link";

const TOOL_URL = "https://humble-beauty-production-82c1.up.railway.app/Stock_Analysis?embed=true&embed_options=show_sidebar";

export default function StockAnalysisPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-[#0d1426]/95 backdrop-blur border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/tools" className="text-gray-400 hover:text-white text-sm transition">← All Tools</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">📈 Stock Analysis</h1>
        </div>
      </div>
      <div className="flex-1 pt-[109px]">
        <iframe
          src={TOOL_URL}
          className="w-full h-[calc(100vh-109px)] border-0"
          title="Stock Analysis"
          allow="clipboard-write"
        />
      </div>
    </main>
  );
}
