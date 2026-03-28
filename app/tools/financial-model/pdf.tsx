import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#ffffff", fontFamily: "Helvetica", fontSize: 10, color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #1d4ed8" },
  headerTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#0a0f1e" },
  headerSub: { fontSize: 11, color: "#4b5563", marginTop: 4 },
  headerMeta: { fontSize: 9, color: "#9ca3af" },
  sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 8 },
  kpiRow: { flexDirection: "row", gap: 10 },
  kpiCard: { flex: 1, padding: 10, backgroundColor: "#f8fafc", borderRadius: 6, borderLeft: "3px solid #3b82f6" },
  kpiCardGreen: { borderLeft: "3px solid #22c55e" },
  kpiCardRed: { borderLeft: "3px solid #ef4444" },
  kpiLabel: { fontSize: 7, color: "#9ca3af", textTransform: "uppercase", marginBottom: 3 },
  kpiValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#0a0f1e" },
  kpiSub: { fontSize: 7, color: "#9ca3af", marginTop: 2 },
  tableHeader: { flexDirection: "row", backgroundColor: "#1d4ed8", padding: "6 8" },
  tableHeaderCell: { flex: 1, fontSize: 8, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  tableRow: { flexDirection: "row", padding: "5 8", borderBottom: "1px solid #f1f5f9" },
  tableRowAlt: { flexDirection: "row", padding: "5 8", backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" },
  tableRowBold: { flexDirection: "row", padding: "5 8", backgroundColor: "#eff6ff", borderBottom: "2px solid #bfdbfe" },
  tableCell: { flex: 1, fontSize: 8, color: "#374151" },
  tableCellBold: { flex: 1, fontSize: 8, fontFamily: "Helvetica-Bold", color: "#0a0f1e" },
  tableCellGreen: { flex: 1, fontSize: 8, color: "#16a34a" },
  tableCellRed: { flex: 1, fontSize: 8, color: "#dc2626" },
  footer: { position: "absolute", bottom: 28, left: 40, right: 40, borderTop: "1px solid #e5e7eb", paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 8, color: "#9ca3af" },
});

const fmt = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });
const fmtM = (n: number) => n.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pct = (n: number) => `${fmtM(n)}%`;

interface YearData {
  year: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  opex: number;
  ebitda: number;
  ebitdaMargin: number;
  depreciation: number;
  ebit: number;
  interest: number;
  ebt: number;
  tax: number;
  netIncome: number;
  netMargin: number;
}

interface Props {
  companyName: string;
  years: YearData[];
  cagr: number;
  avgEbitdaMargin: number;
  avgNetMargin: number;
  year5Revenue: number;
}

export default function FinancialModelPDF({ companyName, years, cagr, avgEbitdaMargin, avgNetMargin, year5Revenue }: Props) {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const y1 = years[0];
  const y5 = years[years.length - 1];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>5-Year Financial Model</Text>
            <Text style={styles.headerSub}>{companyName}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.headerMeta}>Generated {date}</Text>
            <Text style={[styles.headerMeta, { marginTop: 2 }]}>FinancePlots</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>5-Year Highlights</Text>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Year 1 Revenue</Text>
            <Text style={styles.kpiValue}>£{fmt(y1.revenue)}</Text>
            <Text style={styles.kpiSub}>Base year</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardGreen]}>
            <Text style={styles.kpiLabel}>Year 5 Revenue</Text>
            <Text style={styles.kpiValue}>£{fmt(y5.revenue)}</Text>
            <Text style={styles.kpiSub}>CAGR {pct(cagr)}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Avg EBITDA Margin</Text>
            <Text style={styles.kpiValue}>{pct(avgEbitdaMargin)}</Text>
            <Text style={styles.kpiSub}>5-year average</Text>
          </View>
          <View style={[styles.kpiCard, y5.netIncome >= 0 ? styles.kpiCardGreen : styles.kpiCardRed]}>
            <Text style={styles.kpiLabel}>Avg Net Margin</Text>
            <Text style={styles.kpiValue}>{pct(avgNetMargin)}</Text>
            <Text style={styles.kpiSub}>5-year average</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Income Statement — 5-Year Projection</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Metric</Text>
          {years.map(y => <Text key={y.year} style={styles.tableHeaderCell}>Year {y.year}</Text>)}
        </View>

        {[
          { label: "Revenue", key: "revenue", bold: true, color: "green" },
          { label: "COGS", key: "cogs", color: "red" },
          { label: "Gross Profit", key: "grossProfit", bold: true },
          { label: "Gross Margin %", key: "grossMargin", pct: true },
          { label: "OpEx", key: "opex", color: "red" },
          { label: "EBITDA", key: "ebitda", bold: true },
          { label: "EBITDA Margin %", key: "ebitdaMargin", pct: true },
          { label: "D&A", key: "depreciation", color: "red" },
          { label: "EBIT", key: "ebit", bold: true },
          { label: "Interest", key: "interest", color: "red" },
          { label: "EBT", key: "ebt" },
          { label: "Tax", key: "tax", color: "red" },
          { label: "Net Income", key: "netIncome", bold: true, color: "dynamic" },
          { label: "Net Margin %", key: "netMargin", pct: true },
        ].map(({ label, key, bold, color, pct: isPct }, idx) => (
          <View key={label} style={bold ? styles.tableRowBold : idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={[bold ? styles.tableCellBold : styles.tableCell, { flex: 2 }]}>{label}</Text>
            {years.map(y => {
              const val = y[key as keyof YearData] as number;
              let cellStyle = bold ? styles.tableCellBold : styles.tableCell;
              if (color === "green") cellStyle = styles.tableCellGreen;
              else if (color === "red") cellStyle = styles.tableCellRed;
              else if (color === "dynamic") cellStyle = val >= 0 ? styles.tableCellGreen : styles.tableCellRed;
              return (
                <Text key={y.year} style={cellStyle}>
                  {isPct ? `${fmtM(val)}%` : `£${fmt(val)}`}
                </Text>
              );
            })}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>FinancePlots · financeplots.com</Text>
          <Text style={styles.footerText}>For informational purposes only · Not financial advice</Text>
        </View>
      </Page>
    </Document>
  );
}
