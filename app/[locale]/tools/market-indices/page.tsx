"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import RelatedTools from "@/components/RelatedTools";
import TradingViewWidget from "./TradingViewWidget";

// ── Index reference data ─────────────────────────────────────────────────────

interface IndexInfo {
  name: string;
  symbol: string;
  flag: string;
  country: string;
  exchange: string;
  desc: string;
  yahooSymbol: string;
}

const INDICES: Record<string, IndexInfo[]> = {
  "🌎 Americas": [
    { name: "S&P 500",           symbol: "^GSPC",    flag: "🇺🇸", country: "USA",    exchange: "NYSE / NASDAQ",  desc: "500 largest US companies by market cap. The global benchmark.",                yahooSymbol: "^GSPC"    },
    { name: "Nasdaq Composite",  symbol: "^IXIC",    flag: "🇺🇸", country: "USA",    exchange: "NASDAQ",         desc: "Tech-heavy index of 3,000+ NASDAQ-listed stocks.",                          yahooSymbol: "^IXIC"    },
    { name: "Dow Jones (DJIA)",  symbol: "^DJI",     flag: "🇺🇸", country: "USA",    exchange: "NYSE",           desc: "30 blue-chip US companies. Oldest and most quoted US index.",               yahooSymbol: "^DJI"     },
    { name: "Russell 2000",      symbol: "^RUT",     flag: "🇺🇸", country: "USA",    exchange: "NYSE",           desc: "2,000 small-cap US stocks. Indicator of domestic economic health.",         yahooSymbol: "^RUT"     },
    { name: "S&P/TSX Composite", symbol: "^GSPTSE",  flag: "🇨🇦", country: "Canada", exchange: "TSX",            desc: "~250 largest companies on the Toronto Stock Exchange.",                     yahooSymbol: "^GSPTSE"  },
    { name: "Bovespa (B3)",      symbol: "^BVSP",    flag: "🇧🇷", country: "Brazil", exchange: "B3",             desc: "Main benchmark of the Brazilian stock market.",                            yahooSymbol: "^BVSP"    },
    { name: "IPC (Mexico)",      symbol: "^MXX",     flag: "🇲🇽", country: "Mexico", exchange: "BMV",            desc: "35 most liquid and representative Mexican companies.",                      yahooSymbol: "^MXX"     },
  ],
  "🌍 Europe": [
    { name: "FTSE 100",          symbol: "^FTSE",    flag: "🇬🇧", country: "UK",      exchange: "LSE",          desc: "100 largest companies on the London Stock Exchange.",                       yahooSymbol: "^FTSE"    },
    { name: "DAX 40",            symbol: "^GDAXI",   flag: "🇩🇪", country: "Germany", exchange: "XETRA",        desc: "40 largest German companies. Key indicator of the German economy.",         yahooSymbol: "^GDAXI"   },
    { name: "CAC 40",            symbol: "^FCHI",    flag: "🇫🇷", country: "France",  exchange: "Euronext Paris","desc": "40 largest French companies listed on Euronext Paris.",                   yahooSymbol: "^FCHI"    },
    { name: "EURO STOXX 50",     symbol: "^STOXX50E",flag: "🇪🇺", country: "Eurozone","exchange": "Euronext",   desc: "50 leading blue-chip companies across the Eurozone.",                       yahooSymbol: "^STOXX50E"},
    { name: "IBEX 35",           symbol: "^IBEX",    flag: "🇪🇸", country: "Spain",   exchange: "BME",          desc: "35 most liquid Spanish companies on the Madrid exchange.",                  yahooSymbol: "^IBEX"    },
    { name: "FTSE MIB",          symbol: "FTSEMIB.MI",flag:"🇮🇹", country: "Italy",   exchange: "Borsa Italiana","desc": "40 largest Italian companies by market cap.",                            yahooSymbol: "FTSEMIB.MI"},
    { name: "SMI",               symbol: "^SSMI",    flag: "🇨🇭", country: "Switzerland","exchange": "SIX",     desc: "20 largest Swiss companies including Nestlé, Novartis and Roche.",         yahooSymbol: "^SSMI"    },
    { name: "AEX",               symbol: "^AEX",     flag: "🇳🇱", country: "Netherlands","exchange": "Euronext","desc": "25 largest Dutch companies including ASML and Shell.",                   yahooSymbol: "^AEX"     },
  ],
  "🌏 Asia-Pacific": [
    { name: "Nikkei 225",        symbol: "^N225",    flag: "🇯🇵", country: "Japan",        exchange: "TSE",        desc: "225 most actively traded Japanese companies. Asia's oldest index.",   yahooSymbol: "^N225"    },
    { name: "Shanghai Composite",symbol: "000001.SS", flag:"🇨🇳", country: "China",        exchange: "SSE",        desc: "All A-shares and B-shares on the Shanghai Stock Exchange.",            yahooSymbol: "000001.SS"},
    { name: "Hang Seng",         symbol: "^HSI",     flag: "🇭🇰", country: "Hong Kong",    exchange: "HKEX",       desc: "~80 largest companies listed on the Hong Kong exchange.",              yahooSymbol: "^HSI"     },
    { name: "CSI 300",           symbol: "000300.SS", flag:"🇨🇳", country: "China",        exchange: "SSE/SZSE",   desc: "300 A-share stocks from Shanghai and Shenzhen exchanges.",             yahooSymbol: "000300.SS"},
    { name: "KOSPI",             symbol: "^KS11",    flag: "🇰🇷", country: "South Korea",  exchange: "KRX",        desc: "All common stocks on the Korea Stock Exchange.",                      yahooSymbol: "^KS11"    },
    { name: "ASX 200",           symbol: "^AXJO",    flag: "🇦🇺", country: "Australia",    exchange: "ASX",        desc: "200 largest companies on the Australian Securities Exchange.",         yahooSymbol: "^AXJO"    },
    { name: "Sensex",            symbol: "^BSESN",   flag: "🇮🇳", country: "India",        exchange: "BSE",        desc: "30 well-established Indian companies on Bombay Stock Exchange.",      yahooSymbol: "^BSESN"   },
    { name: "Nifty 50",          symbol: "^NSEI",    flag: "🇮🇳", country: "India",        exchange: "NSE",        desc: "50 largest Indian companies on the National Stock Exchange.",          yahooSymbol: "^NSEI"    },
    { name: "STI",               symbol: "^STI",     flag: "🇸🇬", country: "Singapore",    exchange: "SGX",        desc: "30 largest companies on the Singapore Exchange.",                     yahooSymbol: "^STI"     },
    { name: "TAIEX",             symbol: "^TWII",    flag: "🇹🇼", country: "Taiwan",       exchange: "TWSE",       desc: "All listed stocks on the Taiwan Stock Exchange.",                     yahooSymbol: "^TWII"    },
  ],
  "📊 Volatility & Bonds": [
    { name: "VIX",               symbol: "^VIX",    flag: "📉", country: "USA",          exchange: "CBOE",       desc: "Fear index. Measures expected S&P 500 volatility over 30 days.",      yahooSymbol: "^VIX"     },
    { name: "US 10-Year Yield",  symbol: "^TNX",    flag: "🏦", country: "USA",          exchange: "CBOE",       desc: "Benchmark US Treasury yield. Rising = tighter financial conditions.",  yahooSymbol: "^TNX"     },
    { name: "US 2-Year Yield",   symbol: "^IRX",    flag: "🏦", country: "USA",          exchange: "CBOE",       desc: "Short-term US rate. Closely follows Fed Funds rate expectations.",     yahooSymbol: "^IRX"     },
    { name: "DXY (Dollar Index)",symbol: "DX-Y.NYB",flag: "💵", country: "USA",          exchange: "ICE",        desc: "Strength of the US dollar vs a basket of 6 major currencies.",       yahooSymbol: "DX-Y.NYB" },
  ],
};

export default function MarketIndicesPage() {
  const tc = useTranslations("toolCommon");

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "World Market Indices",
          "description": "Live prices and reference guide for the world's most important stock market indices across Americas, Europe, and Asia-Pacific.",
          "url": "https://www.financeplots.com/tools/market-indices",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
          "provider": { "@type": "Organization", "name": "FinancePlots", "url": "https://www.financeplots.com" },
        })}}
      />

      {/* Top bar */}
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-[#0d1426]/95 backdrop-blur border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/tools" className="text-gray-400 hover:text-white text-sm transition">{tc("allTools")}</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold hidden sm:block">🌐 World Market Indices</h1>
          <span className="ml-auto text-xs text-gray-600 hidden md:block">{tc("disclaimer")}</span>
        </div>
      </div>

      <div className="pt-[109px] pb-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Markets</p>
            <h2 className="text-3xl font-extrabold text-white mb-2">World Market Indices</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Live prices for the most important global indices, plus a reference guide to what each one measures.
            </p>
          </div>

          {/* TradingView live widget */}
          <div className="bg-[#0d1426] border border-gray-800 rounded-2xl overflow-hidden mb-12">
            <div className="px-6 pt-5 pb-3">
              <h2 className="text-white font-bold text-base mb-0.5">Live Markets</h2>
              <p className="text-xs text-gray-500">Powered by TradingView · Indices, Commodities & Forex</p>
            </div>
            <TradingViewWidget />
          </div>

          {/* Reference guide */}
          <div className="space-y-12">
            {Object.entries(INDICES).map(([region, indices]) => (
              <div key={region}>
                <h2 className="text-lg font-bold text-white mb-5">{region}</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {indices.map(idx => (
                    <a
                      key={idx.symbol}
                      href={`https://finance.yahoo.com/quote/${idx.yahooSymbol}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 bg-[#0d1426] border border-gray-800 hover:border-blue-500/60 rounded-xl p-4 transition"
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{idx.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-white font-bold text-sm group-hover:text-blue-300 transition">{idx.name}</span>
                          <span className="text-xs text-gray-600 font-mono">{idx.symbol}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">{idx.country} · {idx.exchange}</div>
                        <p className="text-xs text-gray-400 leading-relaxed">{idx.desc}</p>
                      </div>
                      <span className="text-gray-600 group-hover:text-blue-400 transition text-sm shrink-0 mt-0.5">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="text-xs text-gray-600 text-center mt-10">
            Index data links to Yahoo Finance for live quotes. TradingView widget shows real-time prices.
          </p>

        </div>
      </div>

      <RelatedTools current="stock-comparison" />
      <p className="text-center text-xs text-gray-600 pb-8 px-4">{tc("disclaimer")}</p>
    </main>
  );
}
