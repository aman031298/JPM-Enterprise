import "dotenv/config";
import bcrypt from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { ROLE_PERMISSIONS } from "../../../shared/permissions.js";
import type { RoleName } from "../../../shared/domain.js";

const prisma = new PrismaClient();
const mockRoot = path.resolve(process.cwd(), "../../mock-data");

async function readJson(name: string) {
  const filePath = path.join(mockRoot, `${name}.json`);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as Array<Record<string, any>>;
}

const complianceStatusMap = {
  Upcoming: "Upcoming",
  Overdue: "Overdue",
  Completed: "Completed",
  "In Progress": "InProgress"
} as const;

const branchStatusMap = {
  Operational: "Operational",
  "Audit Review": "AuditReview"
} as const;

const taskStatusMap = {
  Open: "Open",
  "In Progress": "InProgress",
  Blocked: "Blocked",
  Done: "Done"
} as const;

const auditStatusMap = {
  Planned: "Planned",
  "In Progress": "InProgress",
  Closed: "Closed"
} as const;

const calendarTypeMap = {
  Compliance: "Compliance",
  Task: "Task",
  Audit: "Audit",
  Reminder: "Reminder"
} as const;

async function main() {
  const [roles, companies, branches, departments, users, compliances, calendar, tasks, vendors, audits, risks, documents, notifications, reports] = await Promise.all([
    readJson("roles"),
    readJson("companies"),
    readJson("branches"),
    readJson("departments"),
    readJson("users"),
    readJson("compliances"),
    readJson("calendar"),
    readJson("tasks"),
    readJson("vendors"),
    readJson("audits"),
    readJson("risks"),
    readJson("documents"),
    readJson("notifications"),
    readJson("reports")
  ]);

  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.company.deleteMany();
  await prisma.role.deleteMany();
  await prisma.compliance.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.task.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.documentRecord.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.reportRecord.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.role.createMany({
    data: roles.map((role) => ({
      id: role.id,
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt),
      name: role.name,
      permissions: ROLE_PERMISSIONS[role.name as RoleName] ?? role.permissions
    }))
  });

  await prisma.company.createMany({
    data: companies.map((company) => ({
      id: company.id,
      createdAt: new Date(company.createdAt),
      updatedAt: new Date(company.updatedAt),
      name: company.name,
      industry: company.industry,
      status: company.status,
      complianceScore: company.complianceScore
    }))
  });

  await prisma.branch.createMany({
    data: branches.map((branch) => ({
      id: branch.id,
      createdAt: new Date(branch.createdAt),
      updatedAt: new Date(branch.updatedAt),
      companyId: branch.companyId,
      name: branch.name,
      city: branch.city,
      status: branchStatusMap[branch.status as keyof typeof branchStatusMap]
    }))
  });

  await prisma.department.createMany({
    data: departments.map((department) => ({
      id: department.id,
      createdAt: new Date(department.createdAt),
      updatedAt: new Date(department.updatedAt),
      companyId: department.companyId,
      branchId: department.branchId,
      name: department.name,
      head: department.head
    }))
  });

  const passwordHash = await bcrypt.hash("demo123", 10);

  await prisma.user.createMany({
    data: users.map((user) => ({
      id: user.id,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      name: user.name,
      email: user.email,
      passwordHash,
      roleId: user.roleId,
      companyId: user.companyId,
      departmentId: user.departmentId,
      status: user.status
    }))
  });

  await prisma.compliance.createMany({
    data: compliances.map((compliance) => ({
      id: compliance.id,
      createdAt: new Date(compliance.createdAt),
      updatedAt: new Date(compliance.updatedAt),
      title: compliance.title,
      category: compliance.category,
      owner: compliance.owner,
      dueDate: new Date(compliance.dueDate),
      status: complianceStatusMap[compliance.status as keyof typeof complianceStatusMap],
      priority: compliance.priority
    }))
  });

  await prisma.calendarEvent.createMany({
    data: calendar.map((event) => ({
      id: event.id,
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
      title: event.title,
      date: new Date(event.date),
      type: calendarTypeMap[event.type as keyof typeof calendarTypeMap],
      owner: event.owner
    }))
  });

  await prisma.task.createMany({
    data: tasks.map((task) => ({
      id: task.id,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      title: task.title,
      assignee: task.assignee,
      dueDate: new Date(task.dueDate),
      status: taskStatusMap[task.status as keyof typeof taskStatusMap]
    }))
  });

  await prisma.vendor.createMany({
    data: vendors.map((vendor) => ({
      id: vendor.id,
      createdAt: new Date(vendor.createdAt),
      updatedAt: new Date(vendor.updatedAt),
      name: vendor.name,
      category: vendor.category,
      licenseExpiry: new Date(vendor.licenseExpiry),
      status: vendor.status
    }))
  });

  await prisma.audit.createMany({
    data: audits.map((audit) => ({
      id: audit.id,
      createdAt: new Date(audit.createdAt),
      updatedAt: new Date(audit.updatedAt),
      title: audit.title,
      auditor: audit.auditor,
      status: auditStatusMap[audit.status as keyof typeof auditStatusMap]
    }))
  });

  const firstAuditId = audits[0]?.id;
  const secondAuditId = audits[1]?.id;

  if (firstAuditId) {
    await prisma.checklistItem.createMany({
      data: [
        { auditId: firstAuditId, label: "Verify statutory filings are up to date", done: true },
        { auditId: firstAuditId, label: "Confirm payroll compliance records", done: true },
        { auditId: firstAuditId, label: "Review safety incident logs", done: false },
        { auditId: firstAuditId, label: "Validate vendor license documentation", done: false }
      ]
    });

    await prisma.finding.createMany({
      data: [
        {
          auditId: firstAuditId,
          description: "Fire safety certificate renewal is overdue at the Chennai branch",
          severity: "High",
          status: "Open"
        },
        {
          auditId: firstAuditId,
          description: "Missing signed acknowledgement for updated leave policy",
          severity: "Medium",
          status: "Open"
        },
        {
          auditId: firstAuditId,
          description: "Payroll register reconciled with statutory filing",
          severity: "Low",
          status: "Resolved"
        },
        {
          auditId: firstAuditId,
          description: "Vendor NDA on file lacks countersignature",
          severity: "Medium",
          status: "Resolved"
        }
      ]
    });

    await prisma.evidence.createMany({
      data: [
        { auditId: firstAuditId, title: "Payroll register Q2 export" },
        { auditId: firstAuditId, title: "Fire safety inspection photos" },
        { auditId: firstAuditId, title: "Leave policy acknowledgement tracker" }
      ]
    });
  }

  if (secondAuditId) {
    await prisma.checklistItem.createMany({
      data: [
        { auditId: secondAuditId, label: "Collect vendor compliance certificates", done: false },
        { auditId: secondAuditId, label: "Cross-check license expiry dates", done: false }
      ]
    });
  }

  await prisma.risk.createMany({
    data: risks.map((risk) => ({
      id: risk.id,
      createdAt: new Date(risk.createdAt),
      updatedAt: new Date(risk.updatedAt),
      title: risk.title,
      category: risk.category,
      impact: risk.impact,
      likelihood: risk.likelihood,
      mitigation: risk.mitigation,
      owner: risk.owner
    }))
  });

  await prisma.documentRecord.createMany({
    data: documents.map((document) => ({
      id: document.id,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt),
      title: document.title,
      category: document.category,
      owner: document.owner,
      expiryDate: new Date(document.expiryDate),
      status: document.status,
      fileName: document.fileName ?? null,
      filePath: document.filePath ?? null,
      mimeType: document.mimeType ?? null,
      size: document.size ?? null
    }))
  });

  await prisma.notification.createMany({
    data: notifications.map((notification) => ({
      id: notification.id,
      createdAt: new Date(notification.createdAt),
      updatedAt: new Date(notification.updatedAt),
      title: notification.title,
      description: notification.description,
      severity: notification.severity,
      emailDelivered: false,
      emailRecipient: process.env.DEFAULT_NOTIFICATION_EMAIL ?? null
    }))
  });

  await prisma.reportRecord.createMany({
    data: reports.map((report) => ({
      id: report.id,
      createdAt: new Date(report.createdAt),
      updatedAt: new Date(report.updatedAt),
      title: report.title,
      generatedOn: new Date(report.generatedOn),
      format: report.format,
      status: report.status
    }))
  });

  await prisma.settings.create({
    data: {
      id: "settings-1",
      createdAt: new Date("2026-07-16T00:00:00.000Z"),
      updatedAt: new Date("2026-07-16T00:00:00.000Z"),
      companyPolicy: "Enterprise compliance baseline",
      reminderWindowDays: 30,
      escalationMatrix: ["Compliance Officer", "Company Admin", "Super Admin"],
      complianceCategories: ["Statutory", "Safety", "Payroll", "Environment"],
      documentCategories: ["License", "Statutory", "Policy", "Evidence"],
      riskCategories: ["Regulatory", "Operational", "Third Party", "Security"]
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
