import type { Metadata } from "next";
import StreamlitClient from "./StreamlitClient";

export const metadata: Metadata = {
  title: "Learn Streamlit — Build Finance Apps with Python | FinancePlots",
  description:
    "40 interactive Streamlit lessons covering basics, charts, data handling and deployment. Built for finance professionals and data analysts who know Python.",
  alternates: { canonical: "https://www.financeplots.com/learn/streamlit" },
};

export default function StreamlitLearnPage() {
  return <StreamlitClient />;
}
