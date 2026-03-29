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
  tableHeaderCell: { flex: 1, fontSize: 7, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  tableRow: { flexDirection: "row", padding: "4 8", borderBottom: "1px solid #f1f5f9" },
  tableRowAlt: { flexDirection: "row", padding: "4 8", backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" },
  tableRowNeg: { flexDirection: "row", padding: "4 8", backgroundColor: "#fff1f2", borderBottom: "1px solid #f1f5f9" },
  tableCell: { flex: 1, fontSize: 7, color: "#374151" },
  tableCellBold: { flex: 1, fontSize: 7, fontFamily: "Helvetica-Bold", color: "#0a0f1e" },
  tableCellRed: { flex: 1, fontSize: 7, color: "#dc2626" },
  footer: { position: "absolute", bottom: 28, left: 40, right: 40, borderTop: "1px solid #e5e7eb", paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 8, color: "#9ca3af" },
});

const fmt = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 0 });

interface WeekRow {
  week: number;
  label: string;
  openingBalance: number;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  closingBalance: number;
}

interface Props {
  forecastName: string;
  openingBalance: number;
  totalInflows: number;
  totalOutflows: number;
  closingBalance: number;
  minBalance: number;
  weeksNegative: number;
  rows: WeekRow[];
}

export default function CashFlowPDF({
  forecastName, openingBalance, totalInflows, totalOutflows, closingBalance, minBalance, weeksNegative, rows,
}: Props) {
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>13-Week Cash Flow Forecast</Text>
            <Text style={styles.headerSub}>{forecastName}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.headerMeta}>Generated {date}</Text>
            <Text style={[styles.headerMeta, { marginTop: 2 }]}>FinancePlots</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Summary</Text>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Opening Balance</Text>
            <Text style={styles.kpiValue}>£{fmt(openingBalance)}</Text>
            <Text style={styles.kpiSub}>Week 1 start</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardGreen]}>
            <Text style={styles.kpiLabel}>Total Inflows</Text>
            <Text style={styles.kpiValue}>£{fmt(totalInflows)}</Text>
            <Text style={styles.kpiSub}>13-week total</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardRed]}>
            <Text style={styles.kpiLabel}>Total Outflows</Text>
            <Text style={styles.kpiValue}>£{fmt(totalOutflows)}</Text>
            <Text style={styles.kpiSub}>13-week total</Text>
          </View>
          <View style={[styles.kpiCard, closingBalance >= 0 ? styles.kpiCardGreen : styles.kpiCardRed]}>
            <Text style={styles.kpiLabel}>Closing Balance</Text>
            <Text style={styles.kpiValue}>£{fmt(closingBalance)}</Text>
            <Text style={styles.kpiSub}>{weeksNegative > 0 ? `${weeksNegative} wk negative` : "No negative weeks"}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>13-Week Forecast</Text>
        <View style={styles.tableHeader}>
          {["Wk", "Period", "Opening", "Inflows", "Outflows", "Net", "Closing"].map(h => (
            <Text key={h} style={[styles.tableHeaderCell, h === "Period" ? { flex: 2 } : {}]}>{h}</Text>
          ))}
        </View>
        {rows.map((row, idx) => {
          const isNeg = row.closingBalance < 0;
          const style = isNeg ? styles.tableRowNeg : idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt;
          return (
            <View key={row.week} style={style}>
              <Text style={styles.tableCellBold}>{row.week}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{row.label}</Text>
              <Text style={styles.tableCell}>£{fmt(row.openingBalance)}</Text>
              <Text style={[styles.tableCell, { color: "#16a34a" }]}>£{fmt(row.inflows)}</Text>
              <Text style={[styles.tableCell, { color: "#dc2626" }]}>£{fmt(row.outflows)}</Text>
              <Text style={row.netCashFlow >= 0 ? styles.tableCell : styles.tableCellRed}>
                {row.netCashFlow >= 0 ? "" : "-"}£{fmt(Math.abs(row.netCashFlow))}
              </Text>
              <Text style={isNeg ? styles.tableCellRed : styles.tableCellBold}>£{fmt(row.closingBalance)}</Text>
            </View>
          );
        })}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>FinancePlots · financeplots.com</Text>
          <Text style={styles.footerText}>For informational purposes only · Not financial advice</Text>
        </View>
      </Page>
    </Document>
  );
}
