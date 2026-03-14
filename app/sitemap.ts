import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.financeplots.com";

  const blogSlugs = [
    "cash-flow-forecast-guide",
    "dcf-valuation-guide",
    "break-even-analysis-guide",
    "investment-portfolio-analysis",
    "5-year-financial-model",
    "annual-budget-guide",
    "financial-forecasting",
    "bootstrapping-runway",
    "uk-pension-savings",
    "powerbi-vs-streamlit",
  ];

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/dashboard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...blogSlugs.map((slug) => ({
      url: `${base}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
