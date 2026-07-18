import { NavLink } from "react-router-dom";
import { Building2, CalendarDays, ClipboardCheck, FileText, LayoutDashboard, Settings, ShieldAlert, Users, WalletCards, ShieldCheck } from "lucide-react";
import { moduleNavigation } from "@shared/domain";
import { hasPermission } from "@shared/permissions";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/lib/use-permission";

const iconMap = {
  Dashboard: LayoutDashboard,
  Companies: Building2,
  Branches: Building2,
  Departments: Building2,
  Users: Users,
  "Roles & Permissions": Users,
  "Compliance Library": ClipboardCheck,
  "Compliance Calendar": CalendarDays,
  Tasks: CalendarDays,
  Documents: FileText,
  Audits: ClipboardCheck,
  Risks: ShieldAlert,
  Vendors: WalletCards,
  Reports: LayoutDashboard,
  Settings
};

export function Sidebar() {
  const permissions = usePermissions();
  const visibleModules = moduleNavigation.filter((item) => hasPermission(permissions, item.resource, "read"));

  return (
    <aside className="w-full rounded-2xl border border-line bg-panel p-3 shadow-panel dark:border-white/10 dark:bg-white/[0.03] md:sticky md:top-6 md:flex md:h-[calc(100vh-3rem)] md:w-64 md:flex-col md:p-4">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
          <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-ink dark:text-white">JPM Enterprise</p>
          <p className="truncate text-xs text-ink/50 dark:text-slate-400">Compliance Suite</p>
        </div>
      </div>
      <nav className="space-y-0.5 overflow-y-auto md:flex-1">
        {visibleModules.map((item) => {
          const Icon = iconMap[item.label];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-200"
                    : "text-ink/65 hover:bg-mist hover:text-ink dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
