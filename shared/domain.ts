export type RoleName =
  | "Super Admin"
  | "Company Admin"
  | "Compliance Officer"
  | "HR"
  | "Auditor"
  | "Manager"
  | "Employee"
  | "Vendor";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  roleId: string;
  companyId: string;
  departmentId: string;
  status: "Active" | "Inactive";
}

export interface Role extends BaseEntity {
  name: RoleName;
  permissions: string[];
}

export interface Company extends BaseEntity {
  name: string;
  industry: string;
  status: "Active" | "Pending";
  complianceScore: number;
}

export interface Branch extends BaseEntity {
  companyId: string;
  name: string;
  city: string;
  status: "Operational" | "Audit Review";
}

export interface Department extends BaseEntity {
  companyId: string;
  branchId: string;
  name: string;
  head: string;
}

export interface Compliance extends BaseEntity {
  title: string;
  category: string;
  owner: string;
  dueDate: string;
  status: "Upcoming" | "Overdue" | "Completed" | "In Progress";
  priority: "Low" | "Medium" | "High" | "Critical";
}

export interface CalendarEvent extends BaseEntity {
  title: string;
  date: string;
  type: "Compliance" | "Task" | "Audit" | "Reminder";
  owner: string;
}

export interface Task extends BaseEntity {
  title: string;
  assignee: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Blocked" | "Done";
}

export interface Vendor extends BaseEntity {
  name: string;
  category: string;
  licenseExpiry: string;
  status: "Active" | "Expiring" | "Expired";
}

export interface Audit extends BaseEntity {
  title: string;
  auditor: string;
  status: "Planned" | "In Progress" | "Closed";
}

export interface ChecklistItem extends BaseEntity {
  auditId: string;
  label: string;
  done: boolean;
}

export interface Finding extends BaseEntity {
  auditId: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Resolved";
}

export interface Evidence extends BaseEntity {
  auditId: string;
  title: string;
  fileName?: string | null;
  filePath?: string | null;
  mimeType?: string | null;
  size?: number | null;
}

export interface Risk extends BaseEntity {
  title: string;
  category: string;
  impact: number;
  likelihood: number;
  mitigation: string;
  owner: string;
}

export interface DocumentRecord extends BaseEntity {
  title: string;
  category: string;
  owner: string;
  expiryDate: string;
  status: "Valid" | "Expiring" | "Expired";
  fileName?: string | null;
  filePath?: string | null;
  mimeType?: string | null;
  size?: number | null;
}

export interface Notification extends BaseEntity {
  title: string;
  description: string;
  severity: "Info" | "Warning" | "Critical";
  emailDelivered?: boolean;
  emailRecipient?: string | null;
}

export interface ReportRecord extends BaseEntity {
  title: string;
  generatedOn: string;
  format: "PDF" | "XLSX" | "CSV";
  status: "Ready" | "Queued";
}

export interface DashboardSummary {
  kpis: Array<{ label: string; value: string; trend: string }>;
  upcomingCompliances?: Compliance[];
  overdueCompliances?: Compliance[];
  calendar?: CalendarEvent[];
  risks?: Risk[];
  activities: Array<{ id: string; title: string; at: string; actor: string }>;
  notifications: Notification[];
  documentsExpiring?: DocumentRecord[];
  charts?: {
    complianceStatus?: Array<{ name: string; value: number }>;
    departmentPerformance?: Array<{ name: string; score: number }>;
  };
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleName;
    permissions: string[];
  };
}

export const moduleNavigation = [
  { label: "Dashboard", path: "/dashboard", resource: "dashboard" },
  { label: "Companies", path: "/dashboard/companies", resource: "companies" },
  { label: "Branches", path: "/dashboard/branches", resource: "branches" },
  { label: "Departments", path: "/dashboard/departments", resource: "departments" },
  { label: "Users", path: "/dashboard/users", resource: "users" },
  { label: "Roles & Permissions", path: "/dashboard/roles", resource: "roles" },
  { label: "Compliance Library", path: "/dashboard/compliances", resource: "compliances" },
  { label: "Compliance Calendar", path: "/dashboard/calendar", resource: "calendar" },
  { label: "Tasks", path: "/dashboard/tasks", resource: "tasks" },
  { label: "Documents", path: "/dashboard/documents", resource: "documents" },
  { label: "Audits", path: "/dashboard/audits", resource: "audits" },
  { label: "Risks", path: "/dashboard/risks", resource: "risks" },
  { label: "Vendors", path: "/dashboard/vendors", resource: "vendors" },
  { label: "Reports", path: "/dashboard/reports", resource: "reports" },
  { label: "Settings", path: "/dashboard/settings", resource: "settings" }
] as const;
