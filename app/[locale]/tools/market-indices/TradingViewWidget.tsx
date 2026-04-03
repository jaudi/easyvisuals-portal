"use client";
import { useEffect, useRef } from "react";

export default function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || container.current.querySelector("script")) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "1D",
      showChart: true,
      locale: "en",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "580",
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD",  d: "S&P 500"         },
            { s: "FOREXCOM:NSXUSD",  d: "Nasdaq 100"       },
            { s: "FOREXCOM:DJI",     d: "Dow Jones"        },
            { s: "INDEX:NKY",        d: "Nikkei 225"       },
            { s: "INDEX:DEU40",      d: "DAX"              },
            { s: "FOREXCOM:UKXGBP",  d: "FTSE 100"        },
            { s: "INDEX:CAC40",      d: "CAC 40"           },
            { s: "INDEX:HSI",        d: "Hang Seng"        },
            { s: "BSE:SENSEX",       d: "Sensex (India)"   },
            { s: "INDEX:ASX200",     d: "ASX 200"          },
            { s: "INDEX:KS11",       d: "KOSPI"            },
            { s: "INDEX:IBEX35",     d: "IBEX 35"          },
            { s: "INDEX:SMI",        d: "Swiss SMI"        },
            { s: "TVC:SX5E",         d: "EURO STOXX 50"   },
          ],
          originalTitle: "Indices",
        },
        {
          title: "Commodities",
          symbols: [
            { s: "COMEX:GC1!",  d: "Gold"        },
            { s: "NYMEX:CL1!",  d: "Crude Oil"   },
            { s: "COMEX:SI1!",  d: "Silver"      },
            { s: "CBOT:ZW1!",   d: "Wheat"       },
            { s: "NYMEX:NG1!",  d: "Natural Gas" },
          ],
          originalTitle: "Commodities",
        },
        {
          title: "Forex",
          symbols: [
            { s: "FX:EURUSD", d: "EUR/USD" },
            { s: "FX:GBPUSD", d: "GBP/USD" },
            { s: "FX:USDJPY", d: "USD/JPY" },
            { s: "FX:USDCNH", d: "USD/CNH" },
            { s: "FX:USDINR", d: "USD/INR" },
            { s: "FX:USDCHF", d: "USD/CHF" },
          ],
          originalTitle: "Forex",
        },
      ],
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div ref={container} className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}
