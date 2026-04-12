import type { Metadata } from "next";
import PowerBIClient from "./PowerBIClient";

export const metadata: Metadata = {
  title: "Learn Power BI — Power Query, Modelling, Visuals | FinancePlots",
  description:
    "40 interactive Power BI lessons covering Power Query (M code), DAX modelling, visuals design and advanced topics. Built for finance professionals.",
  alternates: { canonical: "https://www.financeplots.com/learn/power-bi" },
};

export default function PowerBILearnPage() {
  return <PowerBIClient />;
}
