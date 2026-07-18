import { prisma } from "../lib/prisma.js";
import { serializeRecord } from "../utils/serialize.js";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export class ReportService {
  async getReportDashboard() {
    const [reportsRaw, compliancesRaw, risksRaw] = await Promise.all([
      prisma.reportRecord.findMany({ orderBy: { generatedOn: "desc" } }),
      prisma.compliance.findMany(),
      prisma.risk.findMany()
    ]);

    const reports = serializeRecord(reportsRaw);
    const compliances = serializeRecord(compliancesRaw) as unknown as Array<{ dueDate: string; status: string }>;
    const risks = serializeRecord(risksRaw);

    const monthlyBuckets = new Map<string, { completed: number; overdue: number }>();
    for (const compliance of compliances) {
      const date = new Date(compliance.dueDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = monthlyBuckets.get(key) ?? { completed: 0, overdue: 0 };
      if (compliance.status === "Completed") bucket.completed += 1;
      if (compliance.status === "Overdue") bucket.overdue += 1;
      monthlyBuckets.set(key, bucket);
    }

    const monthlyCompliance = Array.from(monthlyBuckets.entries())
      .sort(([a], [b]) => {
        const [ay, am] = a.split("-").map(Number);
        const [by, bm] = b.split("-").map(Number);
        return ay - by || am - bm;
      })
      .map(([key, bucket]) => {
        const [, monthIndex] = key.split("-").map(Number);
        return { month: MONTH_LABELS[monthIndex], ...bucket };
      });

    return {
      reports,
      chartSeries: {
        monthlyCompliance,
        riskMatrix: risks.map((risk: any) => ({
          title: risk.title,
          impact: risk.impact,
          likelihood: risk.likelihood
        }))
      },
      exportOptions: ["PDF", "XLSX", "CSV"]
    };
  }
}
