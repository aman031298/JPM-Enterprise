import type { RoleName } from "./domain.js";

export const RESOURCES = [
  "dashboard",
  "companies",
  "branches",
  "departments",
  "users",
  "roles",
  "compliances",
  "calendar",
  "tasks",
  "documents",
  "audits",
  "risks",
  "vendors",
  "reports",
  "settings"
] as const;

export type Resource = (typeof RESOURCES)[number];
export type Action = "read" | "write";

export function permissionKey(resource: Resource, action: Action) {
  return `${resource}.${action}`;
}

const READ_WRITE = (resource: Resource) => [permissionKey(resource, "read"), permissionKey(resource, "write")];
const READ_ONLY = (resource: Resource) => [permissionKey(resource, "read")];

export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  "Super Admin": ["all"],

  "Company Admin": [
    ...READ_WRITE("dashboard"),
    ...READ_WRITE("companies"),
    ...READ_WRITE("branches"),
    ...READ_WRITE("departments"),
    ...READ_WRITE("users"),
    ...READ_ONLY("roles"),
    ...READ_WRITE("compliances"),
    ...READ_WRITE("calendar"),
    ...READ_WRITE("tasks"),
    ...READ_WRITE("documents"),
    ...READ_ONLY("audits"),
    ...READ_ONLY("risks"),
    ...READ_WRITE("vendors"),
    ...READ_ONLY("reports"),
    ...READ_ONLY("settings")
  ],

  "Compliance Officer": [
    ...READ_ONLY("dashboard"),
    ...READ_ONLY("companies"),
    ...READ_ONLY("branches"),
    ...READ_ONLY("departments"),
    ...READ_WRITE("compliances"),
    ...READ_WRITE("calendar"),
    ...READ_WRITE("tasks"),
    ...READ_WRITE("documents"),
    ...READ_ONLY("audits"),
    ...READ_WRITE("risks"),
    ...READ_ONLY("vendors"),
    ...READ_ONLY("reports")
  ],

  HR: [
    ...READ_ONLY("dashboard"),
    ...READ_WRITE("users"),
    ...READ_ONLY("departments"),
    ...READ_WRITE("documents"),
    ...READ_ONLY("tasks"),
    ...READ_ONLY("compliances")
  ],

  Auditor: [
    ...READ_ONLY("dashboard"),
    ...READ_WRITE("audits"),
    ...READ_WRITE("risks"),
    ...READ_ONLY("documents"),
    ...READ_ONLY("compliances"),
    ...READ_ONLY("reports")
  ],

  Manager: [
    ...READ_ONLY("dashboard"),
    ...READ_WRITE("tasks"),
    ...READ_ONLY("compliances"),
    ...READ_ONLY("calendar"),
    ...READ_ONLY("documents"),
    ...READ_ONLY("reports"),
    ...READ_ONLY("vendors")
  ],

  Employee: [
    ...READ_ONLY("dashboard"),
    ...READ_ONLY("tasks"),
    ...READ_ONLY("documents"),
    ...READ_ONLY("compliances"),
    ...READ_ONLY("calendar")
  ],

  Vendor: [
    ...READ_ONLY("dashboard"),
    ...READ_ONLY("vendors"),
    ...READ_ONLY("documents")
  ]
};

export function hasPermission(permissions: string[], resource: Resource, action: Action): boolean {
  if (permissions.includes("all")) {
    return true;
  }
  if (action === "read" && permissions.includes(permissionKey(resource, "write"))) {
    return true;
  }
  return permissions.includes(permissionKey(resource, action));
}
