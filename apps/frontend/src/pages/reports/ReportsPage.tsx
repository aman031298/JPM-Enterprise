import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import type { ReportRecord } from "@shared/domain";

const exportConfig: Record<string, { path: string; filename: string }> = {
  PDF: { path: "/reports/export/pdf", filename: "compliance-report.pdf" },
  XLSX: { path: "/reports/export/xlsx", filename: "compliance-report.xlsx" },
  CSV: { path: "/reports/export/csv", filename: "compliance-report.csv" }
};

interface ReportSummary {
  reports: ReportRecord[];
  chartSeries: {
    monthlyCompliance: Array<{ month: string; completed: number; overdue: number }>;
    riskMatrix: Array<{ title: string; impact: number; likelihood: number }>;
  };
  exportOptions: string[];
}

export function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["reports-summary"],
    queryFn: () => api.get<ReportSummary>("/reports/summary")
  });

  if (!data) {
    return <div className="text-sm text-ink/60 dark:text-slate-400">Loading reports...</div>;
  }

  async function handleExport(option: string) {
    const config = exportConfig[option];
    if (!config) return;
    setDownloading(option);
    try {
      await api.download(config.path, config.filename);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Reporting dashboard with monthly trends and export actions."
        action={
          <div className="flex gap-2">
            {data.exportOptions.map((option) => (
              <Button key={option} variant="outline" size="md" onClick={() => handleExport(option)} disabled={downloading === option}>
                <Download className="h-4 w-4" />
                {downloading === option ? "Exporting..." : option}
              </Button>
            ))}
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <h3 className="text-base font-semibold">Monthly Compliance Report</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
              <BarChart data={data.chartSeries.monthlyCompliance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dde1ea" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#dde1ea" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#898781" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #dde1ea", fontSize: 13 }} cursor={{ fill: "rgba(42,91,215,0.06)" }} />
                <Bar dataKey="completed" name="Completed" fill="#2a5bd7" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="overdue" name="Overdue" fill="#e0603f" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-ink/60 dark:text-slate-400">
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Completed</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral" /> Overdue</div>
          </div>
        </Card>
        <Card>
          <h3 className="text-base font-semibold">Generated Reports</h3>
          <div className="mt-4 space-y-2.5">
            {data.reports.map((report) => (
              <div key={report.id} className="rounded-xl bg-mist p-3.5 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink dark:text-white">{report.title}</p>
                  <Badge tone={report.status === "Ready" ? "success" : "warning"}>{report.status}</Badge>
                </div>
                <p className="mt-1.5 text-xs text-ink/55 dark:text-slate-400">{report.generatedOn} · {report.format}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
