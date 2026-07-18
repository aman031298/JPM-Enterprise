import { Card } from "./card";

interface DataTableProps<T extends object> {
  title: string;
  rows: T[];
  columns: Array<{ key: Extract<keyof T, string>; label: string; render?: (value: unknown, row: T) => React.ReactNode }>;
}

export function DataTable<T extends object>({
  title,
  rows,
  columns
}: DataTableProps<T>) {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 dark:border-white/10">
        <h3 className="text-base font-semibold">{title}</h3>
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink/60 dark:bg-white/5 dark:text-slate-300">
          {rows.length} records
        </span>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line dark:border-white/10">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-slate-400"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-ink/45 dark:text-slate-400">
                  No records to display.
                </td>
              </tr>
            )}
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-line/70 transition last:border-0 hover:bg-mist dark:border-white/5 dark:hover:bg-white/[0.03]"
              >
                {columns.map((column) => {
                  const value = row[column.key as keyof T] as unknown;
                  return (
                    <td key={String(column.key)} className="whitespace-nowrap px-5 py-3.5">
                      {column.render ? column.render(value, row) : String(value ?? "—")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
