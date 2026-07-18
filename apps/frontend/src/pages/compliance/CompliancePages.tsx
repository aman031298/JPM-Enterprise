import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import type { CalendarEvent, Compliance, Task } from "@shared/domain";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EntityFormModal, type FieldConfig } from "@/components/ui/entity-form-modal";
import { ConfirmDialog } from "@/components/ui/modal";
import { usePermission } from "@/lib/use-permission";

const statusTone: Record<string, "success" | "warning" | "danger" | "default"> = {
  Completed: "success",
  "In Progress": "warning",
  Upcoming: "default",
  Overdue: "danger",
  Open: "default",
  Blocked: "danger",
  Done: "success"
};

const complianceFields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "text", required: true },
  { key: "owner", label: "Owner", type: "text", required: true },
  { key: "dueDate", label: "Due Date", type: "date", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: ["Upcoming", "In Progress", "Overdue", "Completed"] },
  { key: "priority", label: "Priority", type: "select", required: true, options: ["Low", "Medium", "High", "Critical"] }
];

export function ComplianceLibraryPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("compliances", "write");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Compliance | null>(null);
  const [deleting, setDeleting] = useState<Compliance | null>(null);

  const { data } = useQuery({
    queryKey: ["compliances"],
    queryFn: () => api.get<Compliance[]>("/compliances")
  });

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      editing ? api.put(`/compliances/${editing.id}`, values) : api.post("/compliances", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliances"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setFormOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/compliances/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliances"] });
      setDeleting(null);
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Library"
        description="Compliance register with category, ownership, due dates, and status tracking."
        action={
          canWrite ? (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Compliance
            </Button>
          ) : undefined
        }
      />
      <DataTable
        title="Compliance Register"
        rows={data ?? []}
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "owner", label: "Owner" },
          { key: "dueDate", label: "Due Date", render: (value) => String(value).slice(0, 10) },
          {
            key: "status",
            label: "Status",
            render: (value) => <Badge tone={statusTone[String(value)] ?? "default"}>{String(value)}</Badge>
          },
          {
            key: "priority",
            label: "Priority",
            render: (value) => <Badge tone={value === "Critical" || value === "High" ? "danger" : "warning"}>{String(value)}</Badge>
          },
          ...(canWrite
            ? [
                {
                  key: "id" as const,
                  label: "",
                  render: (_value: unknown, row: Compliance) => (
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(row);
                          setFormOpen(true);
                        }}
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleting(row)} aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      </Button>
                    </div>
                  )
                }
              ]
            : [])
        ]}
      />

      <EntityFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          saveMutation.reset();
        }}
        onSubmit={(values) => saveMutation.mutate(values)}
        title={editing ? "Edit Compliance" : "Add Compliance"}
        fields={complianceFields}
        initialValues={editing}
        isPending={saveMutation.isPending}
        errorMessage={saveMutation.isError ? (saveMutation.error as Error).message : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete compliance record"
        description="This action cannot be undone."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

const eventTypeTone: Record<CalendarEvent["type"], "default" | "warning" | "danger" | "success"> = {
  Compliance: "default",
  Task: "warning",
  Audit: "danger",
  Reminder: "success"
};

function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function ComplianceCalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { data } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => api.get<CalendarEvent[]>("/calendar")
  });

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of data ?? []) {
      const date = new Date(event.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [data]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ day: number | null; key: string }> = [];
  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ day: null, key: `pad-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, key: `${year}-${month}-${day}` });
  }

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const today = new Date();
  const isCurrentMonth = formatMonthKey(today) === formatMonthKey(cursor);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Calendar"
        description="Shared calendar surface for compliances, tasks, audits, and reminders."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-32 text-center text-sm font-semibold text-ink dark:text-white">{monthLabel}</span>
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <Card className="p-0">
        <div className="grid grid-cols-7 border-b border-line dark:border-white/10">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <div key={label} className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-slate-400">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell) => {
            const dayEvents = cell.day ? eventsByDay.get(`${year}-${month}-${cell.day}`) ?? [] : [];
            const isToday = isCurrentMonth && cell.day === today.getDate();
            return (
              <div
                key={cell.key}
                className={`min-h-[96px] border-b border-r border-line p-1.5 last:border-r-0 dark:border-white/10 ${cell.day ? "" : "bg-mist/40 dark:bg-white/[0.02]"}`}
              >
                {cell.day && (
                  <>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isToday ? "bg-accent text-white" : "text-ink/60 dark:text-slate-400"}`}
                    >
                      {cell.day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="truncate rounded px-1.5 py-0.5 text-[11px] font-medium" title={event.title}>
                          <Badge tone={eventTypeTone[event.type]} icon={false}>
                            {event.title}
                          </Badge>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="px-1 text-[10px] text-ink/45 dark:text-slate-500">+{dayEvents.length - 3} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((event) => (
          <Card key={event.id}>
            <div className="flex items-center justify-between">
              <Badge tone={eventTypeTone[event.type]}>{event.type}</Badge>
              <span className="text-xs font-medium text-ink/45 dark:text-slate-400">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <h3 className="mt-3 text-base font-semibold">{event.title}</h3>
            <p className="mt-1 text-sm text-ink/55 dark:text-slate-400">{event.owner}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

const taskFields: FieldConfig[] = [
  { key: "title", label: "Task", type: "text", required: true },
  { key: "assignee", label: "Assignee", type: "text", required: true },
  { key: "dueDate", label: "Due Date", type: "date", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: ["Open", "In Progress", "Blocked", "Done"] }
];

export function TasksPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("tasks", "write");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get<Task[]>("/tasks")
  });

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      editing ? api.put(`/tasks/${editing.id}`, values) : api.post("/tasks", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setFormOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeleting(null);
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Management"
        description="Task ownership and progress tracking tied to compliance execution."
        action={
          canWrite ? (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          ) : undefined
        }
      />
      <DataTable
        title="Tasks"
        rows={data ?? []}
        columns={[
          { key: "title", label: "Task" },
          { key: "assignee", label: "Assignee" },
          { key: "dueDate", label: "Due Date", render: (value) => String(value).slice(0, 10) },
          {
            key: "status",
            label: "Status",
            render: (value) => <Badge tone={statusTone[String(value)] ?? "default"}>{String(value)}</Badge>
          },
          ...(canWrite
            ? [
                {
                  key: "id" as const,
                  label: "",
                  render: (_value: unknown, row: Task) => (
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(row);
                          setFormOpen(true);
                        }}
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleting(row)} aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      </Button>
                    </div>
                  )
                }
              ]
            : [])
        ]}
      />

      <EntityFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          saveMutation.reset();
        }}
        onSubmit={(values) => saveMutation.mutate(values)}
        title={editing ? "Edit Task" : "Add Task"}
        fields={taskFields}
        initialValues={editing}
        isPending={saveMutation.isPending}
        errorMessage={saveMutation.isError ? (saveMutation.error as Error).message : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete task"
        description="This action cannot be undone."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
