"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import RelatedTools from "@/components/RelatedTools";

const TOOL_URL = "https://humble-beauty-production-82c1.up.railway.app/Stock_Comparison?embed=true&embed_options=show_sidebar";

export default function StockComparisonPage() {
  const tc = useTranslations("toolCommon");
  const tn = useTranslations("nav");
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Stock Comparison Tool",
          "description": "Compare multiple stocks side by side — price performance, fundamentals, and ratios. Free, no signup.",
          "url": "https://www.financeplots.com/tools/stock-comparison",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
          "provider": { "@type": "Organization", "name": "FinancePlots", "url": "https://www.financeplots.com" }
        })}}
      />
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-[#0d1426]/95 backdrop-blur border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/tools" className="text-gray-400 hover:text-white text-sm transition">{tc("allTools")}</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">📉 {tn("stockComparison")}</h1>
          <span className="ml-auto text-xs text-gray-600 hidden md:block">{tc("disclaimer")}</span>
        </div>
      </div>
      <div className="flex-1 pt-[109px]">
        <iframe
          src={TOOL_URL}
          className="w-full h-[calc(100vh-109px)] border-0"
          title="Stock Comparison"
          allow="clipboard-write"
        />
      </div>
      <RelatedTools current="stock-comparison" />
    </main>
  );
}
