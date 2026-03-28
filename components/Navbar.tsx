"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FPA_TOOLS = [
  { label: "🗺️ Financial Journey", href: "/tools/financial-planner", featured: true },
  { label: "⚖️ Break-Even",         href: "/tools/break-even"         },
  { label: "📈 Financial Model",    href: "/tools/financial-model"    },
  { label: "💰 Annual Budget",      href: "/tools/annual-budget"      },
  { label: "💧 Cash Flow Forecast", href: "/tools/cash-flow"          },
  { label: "🏢 Business Valuation", href: "/tools/valuation"          },
  { label: "🏦 Lending Calculator", href: "/tools/lending"            },
  { label: "💸 Personal Budget",    href: "/tools/personal-budget"    },
  { label: "💹 Compound Interest",  href: "/tools/compound-interest"  },
];

const MARKET_TOOLS = [
  { label: "📊 Portfolio Analysis", href: "/tools/portfolio-analysis" },
  { label: "📉 Stock Comparison",   href: "/tools/stock-comparison"   },
  { label: "📈 Stock Analysis",     href: "/tools/stock-analysis"     },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setToolsOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[65px]">

        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight shrink-0">
          Finance<span className="text-blue-400">Plots</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-400">

          {/* Tools dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setToolsOpen(v => !v)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition font-medium ${
                pathname?.startsWith("/tools") ? "text-white bg-blue-600/10" : "hover:text-white hover:bg-white/5"
              }`}
            >
              Tools
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {toolsOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 w-64 bg-[#0d1426] border border-gray-700 rounded-2xl shadow-2xl shadow-black/60 overflow-y-auto max-h-[80vh]">
                <div className="p-2">

                  {/* Featured */}
                  <Link
                    href="/tools/financial-planner"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 mb-2 transition"
                  >
                    🗺️ Financial Journey
                  </Link>

                  {/* FP&A */}
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider px-3 py-1">FP&A Tools</p>
                  {FPA_TOOLS.filter(t => !t.featured).map(t => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm transition ${
                        pathname === t.href ? "text-white bg-blue-600/15" : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}

                  {/* Market */}
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider px-3 py-1 mt-2">Market Tools</p>
                  {MARKET_TOOLS.map(t => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm transition ${
                        pathname === t.href ? "text-white bg-blue-600/15" : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}

                  <div className="border-t border-gray-800 mt-2 pt-2">
                    <Link
                      href="/tools"
                      className="flex items-center justify-center px-3 py-2 rounded-lg text-xs text-blue-400 hover:text-blue-300 transition"
                    >
                      View all tools →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className={`px-4 py-2 rounded-lg transition font-medium ${
              pathname?.startsWith("/blog") ? "text-white bg-blue-600/10" : "hover:text-white hover:bg-white/5"
            }`}
          >
            Blog
          </Link>

          <Link href="/#contact" className="px-4 py-2 rounded-lg transition font-medium hover:text-white hover:bg-white/5">
            Contact
          </Link>

          <Link
            href="/tools/financial-planner"
            className="ml-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold transition shadow-lg shadow-blue-600/20"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg transition"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1426] border-t border-gray-800 px-4 py-4 flex flex-col gap-1 text-sm max-h-[80vh] overflow-y-auto">
          <Link href="/tools/financial-planner" className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-blue-300 bg-blue-600/10 border border-blue-600/20 mb-2">
            🗺️ Financial Journey Planner
          </Link>

          <p className="text-xs text-gray-600 font-bold uppercase tracking-wider px-4 py-1">FP&A Tools</p>
          {FPA_TOOLS.filter(t => !t.featured).map(t => (
            <Link key={t.href} href={t.href} className={`px-4 py-2.5 rounded-lg transition ${pathname === t.href ? "text-white bg-blue-600/15" : "text-gray-300 hover:text-white"}`}>
              {t.label}
            </Link>
          ))}

          <p className="text-xs text-gray-600 font-bold uppercase tracking-wider px-4 py-1 mt-2">Market Tools</p>
          {MARKET_TOOLS.map(t => (
            <Link key={t.href} href={t.href} className={`px-4 py-2.5 rounded-lg transition ${pathname === t.href ? "text-white bg-blue-600/15" : "text-gray-300 hover:text-white"}`}>
              {t.label}
            </Link>
          ))}

          <div className="border-t border-gray-800 mt-3 pt-3 flex flex-col gap-1">
            <Link href="/blog" className="px-4 py-2.5 rounded-lg text-gray-300 hover:text-white transition">Blog</Link>
            <Link href="/#contact" className="px-4 py-2.5 rounded-lg text-gray-300 hover:text-white transition">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
