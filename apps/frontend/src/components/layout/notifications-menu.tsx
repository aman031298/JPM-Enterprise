import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import type { Notification } from "@shared/domain";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<Notification[]>("/notifications"),
    enabled: open
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Button variant="outline" size="md" aria-label="Alerts" onClick={() => setOpen((value) => !value)}>
        <Bell className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-12 z-20 w-80 rounded-xl border border-line bg-panel p-3 shadow-panel-lg dark:border-white/10 dark:bg-[#12161f]">
          <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-slate-500">
            Notifications
          </p>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {!data && <p className="px-1 py-2 text-sm text-ink/50 dark:text-slate-400">Loading...</p>}
            {data?.length === 0 && <p className="px-1 py-2 text-sm text-ink/50 dark:text-slate-400">No notifications.</p>}
            {data?.map((item) => (
              <div key={item.id} className="rounded-lg border border-line p-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink dark:text-white">{item.title}</p>
                  <Badge tone={item.severity === "Critical" ? "danger" : item.severity === "Warning" ? "warning" : "default"}>
                    {item.severity}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink/55 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
