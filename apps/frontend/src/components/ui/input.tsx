import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-accent focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-accent-900/40",
          className
        )}
        {...props}
      />
    );
  }
);

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-sm font-medium text-ink/80 dark:text-slate-300">{children}</span>;
}
