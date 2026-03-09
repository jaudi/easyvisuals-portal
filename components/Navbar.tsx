"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on dashboard (it has its own header)
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          Easy<span className="text-blue-400">Visuals</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/#products" className="hover:text-white transition">Products</Link>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <Link href="/#contact" className="hover:text-white transition">Contact</Link>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            Finance Tools
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1426] border-t border-gray-800 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/#products" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/blog" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/#contact" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/dashboard" className="text-blue-400 font-semibold" onClick={() => setMenuOpen(false)}>Finance Tools →</Link>
        </div>
      )}
    </nav>
  );
}
