import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Vendor } from "@shared/domain";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EntityFormModal, type FieldConfig } from "@/components/ui/entity-form-modal";
import { ConfirmDialog } from "@/components/ui/modal";
import { usePermission } from "@/lib/use-permission";

const statusTone: Record<Vendor["status"], "success" | "warning" | "danger"> = {
  Active: "success",
  Expiring: "warning",
  Expired: "danger"
};

const vendorFields: FieldConfig[] = [
  { key: "name", label: "Vendor Name", type: "text", required: true },
  { key: "category", label: "Category", type: "text", required: true },
  { key: "licenseExpiry", label: "License Expiry", type: "date", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Expiring", "Expired"] }
];

export function VendorsPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("vendors", "write");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [deleting, setDeleting] = useState<Vendor | null>(null);

  const { data } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => api.get<Vendor[]>("/vendors")
  });

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      editing ? api.put(`/vendors/${editing.id}`, values) : api.post("/vendors", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setFormOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/vendors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setDeleting(null);
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Management"
        description="Vendor profiles, license tracking, and expiry alerts."
        action={
          canWrite ? (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          ) : undefined
        }
      />
      <DataTable
        title="Vendor Register"
        rows={data ?? []}
        columns={[
          { key: "name", label: "Vendor" },
          { key: "category", label: "Category" },
          { key: "licenseExpiry", label: "License Expiry" },
          {
            key: "status",
            label: "Status",
            render: (value) => <Badge tone={statusTone[value as Vendor["status"]] ?? "default"}>{String(value)}</Badge>
          },
          ...(canWrite
            ? [
                {
                  key: "id" as const,
                  label: "",
                  render: (_value: unknown, row: Vendor) => (
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
        title={editing ? "Edit Vendor" : "Add Vendor"}
        fields={vendorFields}
        initialValues={editing as Record<string, unknown> | null}
        isPending={saveMutation.isPending}
        errorMessage={saveMutation.isError ? (saveMutation.error as Error).message : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete vendor"
        description="This action cannot be undone."
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
