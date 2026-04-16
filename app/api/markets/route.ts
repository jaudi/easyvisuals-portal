import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

interface RawQuote {
  symbol: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  currency?: string;
}

const SYMBOLS: Record<string, { label: string; group: string; prefix?: string }> = {
  "^GSPC":    { label: "S&P 500",   group: "Indices" },
  "^IXIC":    { label: "NASDAQ",    group: "Indices" },
  "^DJI":     { label: "Dow Jones", group: "Indices" },
  "^FTSE":    { label: "FTSE 100",  group: "Indices" },
  "^GDAXI":   { label: "DAX",       group: "Indices" },
  "EURUSD=X": { label: "EUR/USD",   group: "FX" },
  "GBPUSD=X": { label: "GBP/USD",   group: "FX" },
  "USDJPY=X": { label: "USD/JPY",   group: "FX" },
  "GC=F":     { label: "Gold",      group: "Commodities", prefix: "$" },
  "CL=F":     { label: "WTI Oil",   group: "Commodities", prefix: "$" },
  "BTC-USD":  { label: "Bitcoin",   group: "Crypto",      prefix: "$" },
  "^TNX":     { label: "US 10Y",    group: "Rates",       prefix: "" },
  "^VIX":     { label: "VIX",       group: "Rates" },
};

export const revalidate = 60;

function mapQuote(q: RawQuote) {
  const meta = SYMBOLS[q.symbol] ?? { label: q.symbol, group: "Other" };
  return {
    symbol: q.symbol,
    label: meta.label,
    group: meta.group,
    prefix: meta.prefix ?? "",
    price: q.regularMarketPrice ?? null,
    change: q.regularMarketChange ?? null,
    changePct: q.regularMarketChangePercent ?? null,
    currency: q.currency ?? "",
  };
}

// v3: default export is the YahooFinance class
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const YF = yahooFinance as any;
const yf = new YF({ suppressNotices: ["yahooSurvey"] });

export async function GET() {
  try {
    const symbols = Object.keys(SYMBOLS);
    const raw: RawQuote[] = await yf.quote(symbols, {}, { validateResult: false });
    const arr = Array.isArray(raw) ? raw : [raw];
    const quotes = arr.map(mapQuote);
    return NextResponse.json({ quotes, ts: Date.now() });
  } catch (err) {
    console.error("Markets API error:", err);
    return NextResponse.json({ quotes: [], ts: Date.now() }, { status: 500 });
  }
}
