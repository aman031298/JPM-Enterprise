import type { DashboardSummary } from "../../../../shared/domain.js";
import { hasPermission } from "../../../../shared/permissions.js";
import { prisma } from "../lib/prisma.js";
import { serializeRecord } from "../utils/serialize.js";

export class DashboardService {
  async getSummary(permissions: string[]): Promise<DashboardSummary> {
    const canCompliances = hasPermission(permissions, "compliances", "read");
    const canCalendar = hasPermission(permissions, "calendar", "read");
    const canTasks = hasPermission(permissions, "tasks", "read");
    const canAudits = hasPermission(permissions, "audits", "read");
    const canVendors = hasPermission(permissions, "vendors", "read");
    const canRisks = hasPermission(permissions, "risks", "read");
    const canDocuments = hasPermission(permissions, "documents", "read");
    const canCompanies = hasPermission(permissions, "companies", "read");
    const canUsers = hasPermission(permissions, "users", "read");

    const [
      compliancesRaw,
      calendarRaw,
      notificationsRaw,
      risksRaw,
      tasksRaw,
      auditsCount,
      vendorAlertsCount,
      documentsRaw,
      activeUsersCount
    ] = await Promise.all([
      canCompliances ? prisma.compliance.findMany({ orderBy: { dueDate: "asc" } }) : Promise.resolve([]),
      canCalendar ? prisma.calendarEvent.findMany({ orderBy: { date: "asc" } }) : Promise.resolve([]),
      prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      canRisks ? prisma.risk.findMany({ orderBy: { updatedAt: "desc" } }) : Promise.resolve([]),
      canTasks ? prisma.task.findMany({ orderBy: { dueDate: "asc" } }) : Promise.resolve([]),
      canAudits ? prisma.audit.count() : Promise.resolve(null),
      canVendors ? prisma.vendor.count({ where: { status: { in: ["Expiring", "Expired"] } } }) : Promise.resolve(null),
      canDocuments
        ? prisma.documentRecord.findMany({ where: { status: { in: ["Expiring", "Expired"] } }, orderBy: { expiryDate: "asc" }, take: 5 })
        : Promise.resolve([]),
      canUsers ? prisma.user.count({ where: { status: "Active" } }) : Promise.resolve(null)
    ]);

    const compliances = serializeRecord(compliancesRaw) as unknown as NonNullable<DashboardSummary["upcomingCompliances"]>;
    const calendar = serializeRecord(calendarRaw) as unknown as NonNullable<DashboardSummary["calendar"]>;
    const notifications = serializeRecord(notificationsRaw) as unknown as DashboardSummary["notifications"];
    const risks = serializeRecord(risksRaw) as unknown as NonNullable<DashboardSummary["risks"]>;
    const tasks = serializeRecord(tasksRaw) as unknown as Array<{ status: string }>;
    const documentsExpiring = serializeRecord(documentsRaw) as unknown as NonNullable<DashboardSummary["documentsExpiring"]>;

    const kpis: DashboardSummary["kpis"] = [];

    if (canCompliances) {
      const completed = compliances.filter((item) => item.status === "Completed").length;
      const total = compliances.length || 1;
      kpis.push({
        label: "Compliance Score",
        value: `${Math.round((completed / total) * 100)}%`,
        trend: `${compliances.filter((item) => item.status === "Overdue").length} overdue`
      });
    }

    if (canTasks) {
      kpis.push({ label: "Open Tasks", value: `${tasks.length}`, trend: "Live from PostgreSQL" });
    }

    if (canAudits) {
      kpis.push({ label: "Active Audits", value: `${auditsCount}`, trend: "DB-backed" });
    }

    if (canVendors) {
      kpis.push({ label: "Vendor Alerts", value: `${vendorAlertsCount}`, trend: "Email-ready" });
    }

    if (canDocuments && !canCompliances) {
      kpis.push({ label: "Documents Expiring", value: `${documentsExpiring.length}`, trend: "Action required" });
    }

    if (canUsers) {
      kpis.push({ label: "Active Users", value: `${activeUsersCount}`, trend: "Company-wide" });
    }

    if (kpis.length === 0) {
      kpis.push({ label: "Notifications", value: `${notifications.length}`, trend: "Recent alerts" });
    }

    const summary: DashboardSummary = {
      kpis,
      activities: [
        { id: "act-1", title: "JWT auth enabled for protected modules", at: new Date().toISOString(), actor: "System" },
        { id: "act-2", title: "Prisma repositories serving records", at: new Date().toISOString(), actor: "System" },
        { id: "act-3", title: "Document storage switched to persistent uploads", at: new Date().toISOString(), actor: "System" }
      ],
      notifications
    };

    if (canCompliances) {
      summary.upcomingCompliances = compliances.filter((item) => item.status === "Upcoming" || item.status === "In Progress");
      summary.overdueCompliances = compliances.filter((item) => item.status === "Overdue");
      summary.charts = {
        complianceStatus: [
          { name: "Completed", value: compliances.filter((item) => item.status === "Completed").length },
          { name: "Upcoming", value: compliances.filter((item) => item.status === "Upcoming").length },
          { name: "Overdue", value: compliances.filter((item) => item.status === "Overdue").length },
          { name: "In Progress", value: compliances.filter((item) => item.status === "In Progress").length }
        ]
      };
    }

    if (canCalendar) {
      summary.calendar = calendar;
    }

    if (canRisks) {
      summary.risks = risks;
    }

    if (canDocuments) {
      summary.documentsExpiring = documentsExpiring;
    }

    if (canCompanies) {
      summary.charts = {
        ...summary.charts,
        departmentPerformance: [
          { name: "Compliance", score: 95 },
          { name: "Operations", score: 82 },
          { name: "HR", score: 88 },
          { name: "Vendors", score: 76 }
        ]
      };
    }

    return summary;
  }
}
