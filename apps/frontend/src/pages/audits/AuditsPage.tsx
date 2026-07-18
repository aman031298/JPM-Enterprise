import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Pencil, Plus, Trash2 } from "lucide-react";
import type { Audit } from "@shared/domain";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EntityFormModal } from "@/components/ui/entity-form-modal";
import { ConfirmDialog } from "@/components/ui/modal";
import { usePermission } from "@/lib/use-permission";

const auditFields = [
  { key: "title", label: "Audit Title", type: "text" as const, required: true },
  { key: "auditor", label: "Auditor", type: "text" as const, required: true },
  { key: "status", label: "Status", type: "select" as const, required: true, options: ["Planned", "In Progress", "Closed"] }
];

export function AuditsPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("audits", "write");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Audit | null>(null);
  const [deleting, setDeleting] = useState<Audit | null>(null);

  const { data } = useQuery({
    queryKey: ["audits"],
    queryFn: () => api.get<Audit[]>("/audits")
  });

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      editing ? api.put(`/audits/${editing.id}`, values) : api.post("/audits", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      setFormOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/audits/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      setDeleting(null);
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Management"
        description="Checklist and evidence-oriented audit workspace with findings tracking."
        action={
          canWrite ? (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Audit
            </Button>
          ) : undefined
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {(data ?? []).map((audit) => (
          <Card key={audit.id}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{audit.title}</h3>
              <Badge tone={audit.status === "Closed" ? "success" : "warning"}>{audit.status}</Badge>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-ink/45 dark:text-slate-500">Auditor</p>
              <p className="mt-1.5 text-sm font-medium text-ink dark:text-white">{audit.auditor}</p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4 dark:border-white/10">
              <Link to={`/dashboard/audits/${audit.id}`}>
                <Button variant="secondary" size="sm">
                  Checklist, findings &amp; evidence
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              {canWrite && (
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(audit);
                      setFormOpen(true);
                    }}
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleting(audit)} aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <EntityFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          saveMutation.reset();
        }}
        onSubmit={(values) => saveMutation.mutate(values)}
        title={editing ? "Edit Audit" : "Add Audit"}
        fields={auditFields}
        initialValues={editing}
        isPending={saveMutation.isPending}
        errorMessage={saveMutation.isError ? (saveMutation.error as Error).message : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete audit"
        description="This will permanently delete the audit along with its checklist, findings, and evidence."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
