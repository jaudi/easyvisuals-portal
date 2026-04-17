import { NextResponse } from "next/server";

interface FredObs {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObs[];
}

type Transform = "level" | "yoy_pct";

interface SeriesDef {
  id: string;
  label: string;
  group: string;
  transform: Transform;
}

const SERIES: SeriesDef[] = [
  { id: "GDPC1",    label: "Real GDP YoY",        group: "Growth",    transform: "yoy_pct" },
  { id: "INDPRO",   label: "Industrial Prod YoY", group: "Growth",    transform: "yoy_pct" },
  { id: "CPIAUCSL", label: "CPI Inflation YoY",   group: "Inflation", transform: "yoy_pct" },
  { id: "CPILFESL", label: "Core CPI YoY",        group: "Inflation", transform: "yoy_pct" },
  { id: "PCEPI",    label: "PCE Inflation YoY",   group: "Inflation", transform: "yoy_pct" },
  { id: "UNRATE",   label: "Unemployment",        group: "Labor",     transform: "level" },
  { id: "FEDFUNDS", label: "Fed Funds Rate",      group: "Rates",     transform: "level" },
  { id: "DGS10",    label: "10Y Treasury",        group: "Rates",     transform: "level" },
];

export const revalidate = 86400;

async function fetchSeries(s: SeriesDef, apiKey: string) {
  const limit = s.transform === "yoy_pct" ? (s.id === "GDPC1" ? 6 : 14) : 2;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${s.id}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`FRED ${s.id}: ${res.status}`);
  const json: FredResponse = await res.json();

  const obs = json.observations.filter((o) => o.value !== ".");
  if (obs.length === 0) return null;

  const latest = parseFloat(obs[0].value);
  const date = obs[0].date;

  let value: number;
  let prevValue: number | null = null;

  if (s.transform === "yoy_pct") {
    const lookback = s.id === "GDPC1" ? 4 : 12;
    if (obs.length <= lookback) return null;
    const yearAgo = parseFloat(obs[lookback].value);
    value = ((latest - yearAgo) / yearAgo) * 100;

    if (obs.length > lookback + 1) {
      const prevLatest = parseFloat(obs[1].value);
      const prevYearAgo = parseFloat(obs[lookback + 1].value);
      prevValue = ((prevLatest - prevYearAgo) / prevYearAgo) * 100;
    }
  } else {
    value = latest;
    if (obs.length > 1) prevValue = parseFloat(obs[1].value);
  }

  const change = prevValue != null ? value - prevValue : null;

  return {
    id: s.id,
    label: s.label,
    group: s.group,
    value,
    change,
    date,
  };
}

export async function GET() {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { indicators: [], ts: Date.now(), error: "FRED_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    const results = await Promise.all(
      SERIES.map((s) => fetchSeries(s, apiKey).catch(() => null))
    );
    const indicators = results.filter((r) => r != null);
    return NextResponse.json({ indicators, ts: Date.now() });
  } catch (err) {
    console.error("Macro API error:", err);
    return NextResponse.json({ indicators: [], ts: Date.now() }, { status: 500 });
  }
}
