import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import type { DashboardSummary } from "@shared/domain";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useAuthStore } from "@/store/auth-store";

const CHART_SERIES = ["#2a5bd7", "#e0603f", "#0d9488", "#eda100", "#6d28d9"];

const HEATMAP_STEPS = [
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
  "bg-lime-100 text-lime-800 dark:bg-lime-500/10 dark:text-lime-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-orange-200 text-orange-900 dark:bg-orange-500/20 dark:text-orange-300",
  "bg-rose-300 text-rose-950 dark:bg-rose-500/25 dark:text-rose-300"
];

const roleDescriptions: Record<string, string> = {
  "Super Admin": "Full portfolio overview across every module, company, and role.",
  "Company Admin": "Company-wide compliance, workforce, and vendor overview.",
  "Compliance Officer": "Compliance status, due dates, and risk exposure for your queue.",
  HR: "Workforce status and document expiry tracking.",
  Auditor: "Audit workload, findings, and risk exposure.",
  Manager: "Task ownership and reporting for your team.",
  Employee: "Your assigned tasks and documents.",
  Vendor: "Your license status and shared documents."
};

function heatmapTone(impact: number, likelihood: number) {
  const score = Math.min(5, Math.max(1, Math.round((impact + likelihood) / 2)));
  return HEATMAP_STEPS[score - 1];
}

export function DashboardPage() {
  const session = useAuthStore((state) => state.session);
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<DashboardSummary>("/dashboard")
  });

  if (!data) {
    return <div className="text-sm text-ink/60 dark:text-slate-400">Loading dashboard...</div>;
  }

  const role = session?.user.role ?? "Super Admin";
  const grid = Array.from({ length: 5 }, (_, row) => 5 - row);

  const hasComplianceChart = Boolean(data.charts?.complianceStatus?.length);
  const hasDepartmentChart = Boolean(data.charts?.departmentPerformance?.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${role} Dashboard`}
        description={roleDescriptions[role] ?? "Portfolio overview across compliance status, risk exposure, notifications, and recent activity."}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-sm font-medium text-ink/55 dark:text-slate-400">{kpi.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-ink dark:text-white">{kpi.value}</p>
            <p className="mt-2 text-sm font-medium text-accent-600 dark:text-accent-300">{kpi.trend}</p>
          </Card>
        ))}
      </div>

      {(hasComplianceChart || hasDepartmentChart) && (
        <div className={`grid gap-6 ${hasComplianceChart && hasDepartmentChart ? "xl:grid-cols-[1.1fr_0.9fr]" : ""}`}>
          {hasComplianceChart && (
            <Card>
              <h3 className="text-base font-semibold">Compliance Status</h3>
              <div className="mt-5 h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                  <BarChart data={data.charts!.complianceStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dde1ea" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#dde1ea" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#898781" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(42,91,215,0.06)" }}
                      contentStyle={{ borderRadius: 10, border: "1px solid #dde1ea", fontSize: 13 }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={false}>
                      {data.charts!.complianceStatus!.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_SERIES[index % CHART_SERIES.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
          {hasDepartmentChart && (
            <Card>
              <h3 className="text-base font-semibold">Department Performance</h3>
              <div className="mt-5 h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                  <PieChart>
                    <Pie
                      data={data.charts!.departmentPerformance}
                      dataKey="score"
                      nameKey="name"
                      outerRadius={95}
                      innerRadius={55}
                      paddingAngle={2}
                      label={{ fontSize: 12, fill: "#52514e" }}
                      isAnimationActive={false}
                    >
                      {data.charts!.departmentPerformance!.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_SERIES[index % CHART_SERIES.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #dde1ea", fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {data.charts!.departmentPerformance!.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-ink/60 dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_SERIES[index % CHART_SERIES.length] }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {(data.upcomingCompliances || data.overdueCompliances || data.notifications) && (
        <div className="grid gap-6 xl:grid-cols-3">
          {data.upcomingCompliances && (
            <Card>
              <h3 className="text-base font-semibold">Upcoming Compliances</h3>
              <div className="mt-4 space-y-2.5">
                {data.upcomingCompliances.map((item) => (
                  <div key={item.id} className="rounded-xl bg-mist p-3.5 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-ink dark:text-white">{item.title}</p>
                      <Badge tone="warning">{item.priority}</Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-ink/55 dark:text-slate-400">{item.owner} • {item.dueDate}</p>
                  </div>
                ))}
                {data.upcomingCompliances.length === 0 && <p className="text-sm text-ink/45 dark:text-slate-500">Nothing upcoming.</p>}
              </div>
            </Card>
          )}
          {data.overdueCompliances && (
            <Card>
              <h3 className="text-base font-semibold">Overdue Compliances</h3>
              <div className="mt-4 space-y-2.5">
                {data.overdueCompliances.map((item) => (
                  <div key={item.id} className="rounded-xl bg-mist p-3.5 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-ink dark:text-white">{item.title}</p>
                      <Badge tone="danger">{item.status}</Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-ink/55 dark:text-slate-400">{item.owner} • due {item.dueDate}</p>
                  </div>
                ))}
                {data.overdueCompliances.length === 0 && <p className="text-sm text-ink/45 dark:text-slate-500">Nothing overdue.</p>}
              </div>
            </Card>
          )}
          <Card>
            <h3 className="text-base font-semibold">Notifications</h3>
            <div className="mt-4 space-y-2.5">
              {data.notifications.map((item) => (
                <div key={item.id} className="rounded-xl border border-line p-3.5 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink dark:text-white">{item.title}</p>
                    <Badge tone={item.severity === "Critical" ? "danger" : item.severity === "Warning" ? "warning" : "default"}>
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-ink/55 dark:text-slate-400">{item.description}</p>
                </div>
              ))}
              {data.notifications.length === 0 && <p className="text-sm text-ink/45 dark:text-slate-500">No notifications.</p>}
            </div>
          </Card>
        </div>
      )}

      {(data.risks || data.documentsExpiring) && (
        <div className={`grid gap-6 ${data.risks && data.documentsExpiring ? "xl:grid-cols-[0.85fr_1.15fr]" : ""}`}>
          {data.risks && (
            <Card>
              <h3 className="text-base font-semibold">Risk Heatmap</h3>
              <p className="mt-1 text-xs text-ink/50 dark:text-slate-400">Impact (rows) vs. likelihood (columns), 1–5 scale.</p>
              <div className="mt-4 space-y-1">
                {grid.map((impact) => (
                  <div key={impact} className="flex items-center gap-1">
                    <span className="w-4 shrink-0 text-right text-[10px] font-medium text-ink/40 dark:text-slate-500">{impact}</span>
                    {[1, 2, 3, 4, 5].map((likelihood) => {
                      const count = data.risks!.filter(
                        (risk) => risk.impact === impact && risk.likelihood === likelihood
                      ).length;
                      return (
                        <div
                          key={likelihood}
                          className={`flex h-9 flex-1 items-center justify-center rounded-md text-xs font-semibold ${heatmapTone(impact, likelihood)}`}
                          title={`Impact ${impact} × Likelihood ${likelihood}: ${count} risk${count === 1 ? "" : "s"}`}
                        >
                          {count > 0 ? count : ""}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="flex items-center gap-1 pt-1">
                  <span className="w-4 shrink-0" />
                  {[1, 2, 3, 4, 5].map((likelihood) => (
                    <span key={likelihood} className="flex-1 text-center text-[10px] font-medium text-ink/40 dark:text-slate-500">
                      {likelihood}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}
          {data.documentsExpiring && (
            <Card>
              <h3 className="text-base font-semibold">Documents Expiring Soon</h3>
              <div className="mt-4 space-y-2.5">
                {data.documentsExpiring.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-mist p-3.5 dark:bg-white/5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink dark:text-white">{item.title}</p>
                      <p className="text-xs text-ink/55 dark:text-slate-400">{item.owner}</p>
                    </div>
                    <Badge tone={item.status === "Expired" ? "danger" : "warning"}>{item.status}</Badge>
                  </div>
                ))}
                {data.documentsExpiring.length === 0 && <p className="text-sm text-ink/45 dark:text-slate-500">Nothing expiring soon.</p>}
              </div>
            </Card>
          )}
        </div>
      )}

      <Card>
        <h3 className="text-base font-semibold">Recent Activities</h3>
        <div className="mt-4 space-y-2.5">
          {data.activities.map((item) => (
            <div key={item.id} className="rounded-xl bg-mist p-3.5 dark:bg-white/5">
              <p className="text-sm font-medium text-ink dark:text-white">{item.title}</p>
              <p className="mt-1.5 text-xs text-ink/55 dark:text-slate-400">{item.actor} • {new Date(item.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>

      {data.calendar && (
        <Card>
          <h3 className="text-base font-semibold">Compliance Calendar</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.calendar.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-mist p-3.5 dark:bg-white/5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink dark:text-white">{item.title}</p>
                  <p className="text-xs text-ink/55 dark:text-slate-400">{item.owner}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-ink dark:text-white">{item.date}</p>
                  <p className="text-xs text-ink/55 dark:text-slate-400">{item.type}</p>
                </div>
              </div>
            ))}
            {data.calendar.length === 0 && <p className="text-sm text-ink/45 dark:text-slate-500">No calendar events.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}
