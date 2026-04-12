import { MetadataRoute } from "next";

const BASE = "https://www.financeplots.com";

const BLOG_SLUGS = [
  "financial-forecasting",
  "bootstrapping-runway",
  "uk-pension-savings",
  "powerbi-vs-streamlit",
  "5-year-financial-model",
  "annual-budget-guide",
  "break-even-analysis-guide",
  "cash-flow-forecast-guide",
  "dcf-valuation-guide",
  "investment-portfolio-analysis",
  "personal-budget-guide",
  "python-for-streamlit",
];

const TOOL_SLUGS = [
  "financial-planner",
  "financial-planner-company",
  "break-even",
  "valuation",
  "cash-flow",
  "financial-model",
  "annual-budget",
  "lending",
  "personal-budget",
  "compound-interest",
  "portfolio-analysis",
  "stock-analysis",
  "stock-comparison",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE}/tools`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/learn`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/learn/power-bi`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/learn/streamlit`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/learn/claude-finance`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/es`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE}/es/tools`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/es/blog`, priority: 0.7, changeFrequency: "weekly" as const },
  ];

  const blogPages = BLOG_SLUGS.flatMap((slug) => [
    { url: `${BASE}/blog/${slug}`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/es/blog/${slug}`, priority: 0.6, changeFrequency: "monthly" as const },
  ]);

  const toolPages = TOOL_SLUGS.flatMap((slug) => [
    { url: `${BASE}/tools/${slug}`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/es/tools/${slug}`, priority: 0.7, changeFrequency: "monthly" as const },
  ]);

  return [
    ...staticPages,
    ...blogPages,
    ...toolPages,
  ].map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
