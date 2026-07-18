import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white">{title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm text-ink/60 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
