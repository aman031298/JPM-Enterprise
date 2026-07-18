import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Scatter, ScatterChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ZAxis, CartesianGrid } from "recharts";
import type { Risk } from "@shared/domain";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EntityFormModal, type FieldConfig } from "@/components/ui/entity-form-modal";
import { ConfirmDialog } from "@/components/ui/modal";
import { usePermission } from "@/lib/use-permission";

function severityTone(impact: number, likelihood: number) {
  const score = (impact + likelihood) / 2;
  if (score >= 4) return "danger" as const;
  if (score >= 2.5) return "warning" as const;
  return "success" as const;
}

const riskFields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "category", label: "Category", type: "text", required: true },
  { key: "impact", label: "Impact", type: "number", required: true },
  { key: "likelihood", label: "Likelihood", type: "number", required: true },
  { key: "mitigation", label: "Mitigation", type: "text", required: true },
  { key: "owner", label: "Owner", type: "text", required: true }
];

export function RisksPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("risks", "write");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Risk | null>(null);
  const [deleting, setDeleting] = useState<Risk | null>(null);

  const { data } = useQuery({
    queryKey: ["risks"],
    queryFn: () => api.get<Risk[]>("/risks")
  });

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      editing ? api.put(`/risks/${editing.id}`, values) : api.post("/risks", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setFormOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/risks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      setDeleting(null);
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Management"
        description="Risk register, impact/likelihood matrix, and mitigation ownership."
        action={
          canWrite ? (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Risk
            </Button>
          ) : undefined
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          title="Risk Register"
          rows={data ?? []}
          columns={[
            { key: "title", label: "Risk" },
            { key: "category", label: "Category" },
            {
              key: "impact",
              label: "Severity",
              render: (_value, row) => (
                <Badge tone={severityTone(row.impact, row.likelihood)}>
                  Impact {row.impact} · Likelihood {row.likelihood}
                </Badge>
              )
            },
            { key: "mitigation", label: "Mitigation" },
            { key: "owner", label: "Owner" },
            ...(canWrite
              ? [
                  {
                    key: "id" as const,
                    label: "",
                    render: (_value: unknown, row: Risk) => (
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
        <Card>
          <h3 className="text-base font-semibold">Risk Matrix</h3>
          <p className="mt-1 text-xs text-ink/50 dark:text-slate-400">Likelihood (x) vs. impact (y).</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#dde1ea" className="dark:opacity-10" />
                <XAxis type="number" dataKey="likelihood" name="Likelihood" domain={[0, 5]} tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#dde1ea" }} tickLine={false} />
                <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 5]} tick={{ fontSize: 12, fill: "#898781" }} axisLine={{ stroke: "#dde1ea" }} tickLine={false} />
                <ZAxis range={[100, 140]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: 10, border: "1px solid #dde1ea", fontSize: 13 }} />
                <Scatter data={data ?? []} fill="#e0603f" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <EntityFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          saveMutation.reset();
        }}
        onSubmit={(values) => saveMutation.mutate(values)}
        title={editing ? "Edit Risk" : "Add Risk"}
        fields={riskFields}
        initialValues={editing as Record<string, unknown> | null}
        isPending={saveMutation.isPending}
        errorMessage={saveMutation.isError ? (saveMutation.error as Error).message : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete risk"
        description="This action cannot be undone."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
