import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-panel p-5 shadow-panel dark:border-white/10 dark:bg-white/[0.04]",
        className
      )}
    >
      {children}
    </div>
  );
}
