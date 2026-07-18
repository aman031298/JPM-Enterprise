import { createBrowserRouter } from "react-router-dom";
import type { Branch, Company, Department } from "@shared/domain";
import { AppShell } from "@/components/layout/app-shell";
import { PermissionRoute } from "@/components/layout/permission-route";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { EntityManagementPage } from "@/pages/company/EntityManagementPage";
import { AuditsPage } from "@/pages/audits/AuditsPage";
import { AuditDetailPage } from "@/pages/audits/AuditDetailPage";
import { ComplianceCalendarPage, ComplianceLibraryPage, TasksPage } from "@/pages/compliance/CompliancePages";
import { DocumentsPage } from "@/pages/documents/DocumentsPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { RisksPage } from "@/pages/risks/RisksPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { RolesPage, UsersPage } from "@/pages/users/UserModulePage";
import { VendorsPage } from "@/pages/vendors/VendorsPage";
import { Badge } from "@/components/ui/badge";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/dashboard",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <PermissionRoute resource="dashboard">
            <DashboardPage />
          </PermissionRoute>
        )
      },
      {
        path: "companies",
        element: (
          <PermissionRoute resource="companies">
            <EntityManagementPage<Company>
              title="Company Management"
              description="Manage registered companies, industries, and compliance standing."
              endpoint="companies"
              resource="companies"
              columns={[
                { key: "name", label: "Company" },
                { key: "industry", label: "Industry" },
                {
                  key: "status",
                  label: "Status",
                  render: (value) => <Badge tone={value === "Active" ? "success" : "warning"}>{String(value)}</Badge>
                },
                { key: "complianceScore", label: "Compliance Score" }
              ]}
              fields={[
                { key: "name", label: "Company Name", type: "text", required: true },
                { key: "industry", label: "Industry", type: "text", required: true },
                { key: "status", label: "Status", type: "select", options: ["Active", "Pending"], required: true },
                { key: "complianceScore", label: "Compliance Score", type: "number", required: true }
              ]}
            />
          </PermissionRoute>
        )
      },
      {
        path: "branches",
        element: (
          <PermissionRoute resource="branches">
            <EntityManagementPage<Branch>
              title="Branch Management"
              description="Branch registry for multi-location oversight."
              endpoint="branches"
              resource="branches"
              columns={[
                { key: "name", label: "Branch" },
                { key: "companyId", label: "Company" },
                { key: "city", label: "City" },
                {
                  key: "status",
                  label: "Status",
                  render: (value) => <Badge tone={value === "Operational" ? "success" : "warning"}>{String(value)}</Badge>
                }
              ]}
              fields={[
                { key: "name", label: "Branch Name", type: "text", required: true },
                { key: "companyId", label: "Company ID", type: "text", required: true },
                { key: "city", label: "City", type: "text", required: true },
                { key: "status", label: "Status", type: "select", options: ["Operational", "Audit Review"], required: true }
              ]}
            />
          </PermissionRoute>
        )
      },
      {
        path: "departments",
        element: (
          <PermissionRoute resource="departments">
            <EntityManagementPage<Department>
              title="Department Management"
              description="Department module aligned to company and branch hierarchies."
              endpoint="departments"
              resource="departments"
              columns={[
                { key: "name", label: "Department" },
                { key: "companyId", label: "Company" },
                { key: "branchId", label: "Branch" },
                { key: "head", label: "Head" }
              ]}
              fields={[
                { key: "name", label: "Department Name", type: "text", required: true },
                { key: "companyId", label: "Company ID", type: "text", required: true },
                { key: "branchId", label: "Branch ID", type: "text", required: true },
                { key: "head", label: "Head", type: "text", required: true }
              ]}
            />
          </PermissionRoute>
        )
      },
      {
        path: "users",
        element: (
          <PermissionRoute resource="users">
            <UsersPage />
          </PermissionRoute>
        )
      },
      {
        path: "roles",
        element: (
          <PermissionRoute resource="roles">
            <RolesPage />
          </PermissionRoute>
        )
      },
      {
        path: "compliances",
        element: (
          <PermissionRoute resource="compliances">
            <ComplianceLibraryPage />
          </PermissionRoute>
        )
      },
      {
        path: "calendar",
        element: (
          <PermissionRoute resource="calendar">
            <ComplianceCalendarPage />
          </PermissionRoute>
        )
      },
      {
        path: "tasks",
        element: (
          <PermissionRoute resource="tasks">
            <TasksPage />
          </PermissionRoute>
        )
      },
      {
        path: "documents",
        element: (
          <PermissionRoute resource="documents">
            <DocumentsPage />
          </PermissionRoute>
        )
      },
      {
        path: "audits",
        element: (
          <PermissionRoute resource="audits">
            <AuditsPage />
          </PermissionRoute>
        )
      },
      {
        path: "audits/:auditId",
        element: (
          <PermissionRoute resource="audits">
            <AuditDetailPage />
          </PermissionRoute>
        )
      },
      {
        path: "risks",
        element: (
          <PermissionRoute resource="risks">
            <RisksPage />
          </PermissionRoute>
        )
      },
      {
        path: "vendors",
        element: (
          <PermissionRoute resource="vendors">
            <VendorsPage />
          </PermissionRoute>
        )
      },
      {
        path: "reports",
        element: (
          <PermissionRoute resource="reports">
            <ReportsPage />
          </PermissionRoute>
        )
      },
      {
        path: "settings",
        element: (
          <PermissionRoute resource="settings">
            <SettingsPage />
          </PermissionRoute>
        )
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);
