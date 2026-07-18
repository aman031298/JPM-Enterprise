import { Outlet, Navigate, useLocation } from "react-router-dom";
import { LogOut, MoonStar, SunMedium } from "lucide-react";
import { Sidebar } from "./sidebar";
import { NotificationsMenu } from "./notifications-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

export function AppShell() {
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const darkMode = useUiStore((state) => state.darkMode);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const location = useLocation();

  if (!session) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 p-4 md:grid-cols-[256px_1fr] md:p-6">
      <Sidebar />
      <div className="min-w-0 space-y-6">
        <header className="flex flex-col gap-4 border-b border-line pb-5 dark:border-white/10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40 dark:text-slate-500">Signed in as</p>
            <h1 className="mt-0.5 text-xl font-bold text-ink dark:text-white">{session.user.name}</h1>
            <p className="text-sm text-ink/55 dark:text-slate-400">{session.user.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" onClick={toggleTheme} aria-label="Toggle theme">
              {darkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </Button>
            <NotificationsMenu />
            <Button variant="ghost" size="md" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="space-y-6 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
