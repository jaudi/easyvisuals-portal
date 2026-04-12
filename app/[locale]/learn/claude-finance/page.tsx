import type { Metadata } from "next";
import ClaudeFinanceClient from "./ClaudeFinanceClient";

export const metadata: Metadata = {
  title: "Learn Claude for Finance — AI-Powered Financial Analysis | FinancePlots",
  description:
    "40 free lessons on using Claude AI for financial analysis, modelling, Excel formulas, report writing and automation. Built for finance professionals.",
  alternates: { canonical: "https://www.financeplots.com/learn/claude-finance" },
};

export default function ClaudeFinancePage() {
  return <ClaudeFinanceClient />;
}
