import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
