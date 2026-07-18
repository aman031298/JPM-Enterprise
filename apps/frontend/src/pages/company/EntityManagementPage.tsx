import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Resource } from "@shared/permissions";
import { api } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EntityFormModal, type FieldConfig } from "@/components/ui/entity-form-modal";
import { ConfirmDialog } from "@/components/ui/modal";
import { usePermission } from "@/lib/use-permission";

interface EntityManagementPageProps<T extends { id: string }> {
  title: string;
  description: string;
  endpoint: string;
  resource: Resource;
  columns: Array<{ key: Extract<keyof T, string>; label: string; render?: (value: unknown, row: T) => React.ReactNode }>;
  fields: FieldConfig[];
}

export function EntityManagementPage<T extends { id: string }>({
  title,
  description,
  endpoint,
  resource,
  columns,
  fields
}: EntityManagementPageProps<T>) {
  const queryClient = useQueryClient();
  const canWrite = usePermission(resource, "write");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  const { data } = useQuery({
    queryKey: [endpoint],
    queryFn: () => api.get<T[]>(`/${endpoint}`)
  });

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      editing ? api.put(`/${endpoint}/${editing.id}`, values) : api.post(`/${endpoint}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setFormOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setDeleting(null);
    }
  });

  const actionColumns = canWrite
    ? [
        {
          key: "__actions" as Extract<keyof T, string>,
          label: "",
          render: (_value: unknown, row: T) => (
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
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          canWrite ? (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          ) : undefined
        }
      />
      <DataTable title={title} rows={data ?? []} columns={[...columns, ...actionColumns]} />

      <EntityFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
          saveMutation.reset();
        }}
        onSubmit={(values) => saveMutation.mutate(values)}
        title={editing ? `Edit ${title}` : `Add ${title}`}
        fields={fields}
        initialValues={editing as Record<string, unknown> | null}
        isPending={saveMutation.isPending}
        errorMessage={saveMutation.isError ? (saveMutation.error as Error).message : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete record"
        description="This action cannot be undone. Are you sure you want to delete this record?"
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
