"use client";

import { useEffect, useState, useCallback } from "react";

interface Quote {
  symbol: string;
  label: string;
  group: string;
  prefix: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  currency: string;
}

interface MarketsData {
  quotes: Quote[];
  ts: number;
}

const GROUP_ORDER = ["Indices", "FX", "Commodities", "Crypto", "Rates"];

function fmt(n: number | null, decimals = 2): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function QuoteCard({ q }: { q: Quote }) {
  const up = q.changePct != null && q.changePct >= 0;
  const color = q.changePct == null ? "text-amber-400" : up ? "text-emerald-400" : "text-red-400";
  const arrow = q.changePct == null ? "" : up ? "▲" : "▼";

  // pick decimal precision by group/symbol
  const isIndex = q.group === "Indices";
  const isFX = q.group === "FX";
  const isVIX = q.label === "VIX";
  const is10Y = q.label === "US 10Y";
  const priceDec = isFX ? 4 : isIndex ? 2 : is10Y || isVIX ? 2 : 2;

  return (
    <div className="border border-[#1e2a1e] bg-[#050a05] px-4 py-3 rounded min-w-[120px] flex-1">
      <div className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest mb-1 truncate">
        {q.label}
      </div>
      <div className="font-mono text-white text-sm font-bold tabular-nums">
        {q.price != null ? `${q.prefix}${fmt(q.price, priceDec)}` : "—"}
        {q.group === "Rates" && q.label !== "VIX" && q.price != null ? "%" : ""}
      </div>
      <div className={`font-mono text-xs tabular-nums mt-0.5 ${color}`}>
        {arrow} {q.changePct != null ? `${Math.abs(q.changePct).toFixed(2)}%` : "—"}
      </div>
    </div>
  );
}

export default function MarketPulse() {
  const [data, setData] = useState<MarketsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch("/api/markets", { cache: "no-store" });
      if (!res.ok) return;
      const json: MarketsData = await res.json();
      setData(json);
      setLastUpdate(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      // silent — keep stale data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
    const id = setInterval(fetchMarkets, 60_000);
    return () => clearInterval(id);
  }, [fetchMarkets]);

  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    quotes: data?.quotes.filter((q) => q.group === g) ?? [],
  })).filter((g) => g.quotes.length > 0);

  return (
    <section className="px-6 pb-6">
      <div className="max-w-5xl mx-auto">
        {/* Bloomberg-style panel */}
        <div className="bg-[#020602] border border-amber-900/30 rounded-xl overflow-hidden">

          {/* Terminal header bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-amber-900/30 bg-[#0a0f06]">
            <div className="flex items-center gap-3">
              <span className="text-amber-500 font-mono font-bold text-xs tracking-[0.2em] uppercase">
                ◈ Market Pulse
              </span>
              <span className="text-[10px] font-mono text-amber-900 uppercase tracking-widest hidden sm:block">
                / Live quotes · Powered by Yahoo Finance
              </span>
            </div>
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-pulse" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
              <span className="text-[10px] font-mono text-amber-700">
                {lastUpdate ? `UPD ${lastUpdate}` : "LOADING…"}
              </span>
            </div>
          </div>

          {/* Data groups */}
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="text-amber-700/50 font-mono text-xs text-center py-6 tracking-widest animate-pulse">
                FETCHING MARKET DATA…
              </div>
            ) : grouped.length === 0 ? (
              <div className="text-red-700/50 font-mono text-xs text-center py-6">
                DATA UNAVAILABLE
              </div>
            ) : (
              grouped.map(({ group, quotes }) => (
                <div key={group}>
                  <div className="text-[9px] font-mono text-amber-700 uppercase tracking-[0.3em] mb-2 pl-1 border-l-2 border-amber-700">
                    {group}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quotes.map((q) => (
                      <QuoteCard key={q.symbol} q={q} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer bar */}
          <div className="border-t border-amber-900/20 px-4 py-1.5 bg-[#0a0f06]">
            <p className="text-[9px] font-mono text-amber-900/60 text-center tracking-wide">
              INDICATIVE PRICES ONLY · NOT INVESTMENT ADVICE · 15–20 MIN DELAY MAY APPLY
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
