import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.financeplots.com"),
  title: {
    default: "FinancePlots — Free FP&A Tools for Individuals & Companies",
    template: "%s | FinancePlots",
  },
  description:
    "Free financial planning & analysis tools — personal budget, portfolio analysis, cash flow forecast, DCF valuation, financial model and more. No signup, works in your browser.",
  keywords: [
    "FP&A tools free",
    "financial planning analysis",
    "cash flow forecast online",
    "DCF valuation tool",
    "financial model template",
    "personal budget planner",
    "portfolio analysis free",
    "break even analysis",
    "investment portfolio tracker",
    "13 week cash flow forecast",
  ],
  authors: [{ name: "FinancePlots" }],
  creator: "FinancePlots",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.financeplots.com",
    siteName: "FinancePlots",
    title: "FinancePlots — Free FP&A Tools for Individuals & Companies",
    description:
      "Free financial planning & analysis tools — personal budget, portfolio analysis, cash flow forecast, DCF valuation and more. No signup required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinancePlots — Free FP&A Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinancePlots — Free FP&A Tools for Individuals & Companies",
    description:
      "Free financial planning & analysis tools — personal budget, portfolio analysis, cash flow forecast, DCF valuation and more.",
    images: ["/og-image.png"],
    creator: "@financeplots",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://www.financeplots.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
