import type { PropsWithChildren } from "react";
import { Check, AlertTriangle, AlertOctagon, CircleAlert, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const toneMap = {
  default: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
};

const iconMap = {
  default: Minus,
  success: Check,
  warning: AlertTriangle,
  danger: AlertOctagon
};

export function Badge({
  children,
  tone = "default",
  icon = true
}: PropsWithChildren<{ tone?: keyof typeof toneMap; icon?: boolean }>) {
  const Icon = tone === "danger" ? AlertOctagon : tone === "warning" ? CircleAlert : iconMap[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneMap[tone]
      )}
    >
      {icon && <Icon className="h-3 w-3 shrink-0" strokeWidth={2.5} />}
      {children}
    </span>
  );
}
