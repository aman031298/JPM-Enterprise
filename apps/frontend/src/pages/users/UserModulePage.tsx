import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Role, User } from "@shared/domain";
import { RESOURCES, type Resource } from "@shared/permissions";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { EntityFormModal, type FieldConfig } from "@/components/ui/entity-form-modal";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { usePermission } from "@/lib/use-permission";

const userFields: FieldConfig[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "email", label: "Email", type: "text", required: true },
  { key: "roleId", label: "Role ID", type: "text", required: true },
  { key: "companyId", label: "Company ID", type: "text", required: true },
  { key: "departmentId", label: "Department ID", type: "text", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: ["Active", "Inactive"] }
];

export function UsersPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("users", "write");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<User[]>("/users")
  });

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      editing ? api.put(`/users/${editing.id}`, values) : api.post("/users", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setFormOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleting(null);
    }
  });

  const actionColumns = canWrite
    ? [
        {
          key: "__actions" as Extract<keyof User, string>,
          label: "",
          render: (_value: unknown, row: User) => (
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
        title="Users"
        description="User administration with company assignment, department mapping, and status visibility."
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
      <DataTable
        title="Users"
        rows={data ?? []}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "companyId", label: "Company" },
          { key: "departmentId", label: "Department" },
          {
            key: "status",
            label: "Status",
            render: (value) => <Badge tone={value === "Active" ? "success" : "default"}>{String(value)}</Badge>
          },
          ...actionColumns
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
        title={editing ? "Edit User" : "Add User"}
        fields={userFields}
        initialValues={editing as unknown as Record<string, unknown> | null}
        isPending={saveMutation.isPending}
        errorMessage={saveMutation.isError ? (saveMutation.error as Error).message : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete user"
        description="This action cannot be undone. Are you sure you want to delete this user?"
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

function RolePermissionsModal({
  role,
  open,
  onClose
}: {
  role: Role;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [permissions, setPermissions] = useState<string[]>(role.permissions);

  const saveMutation = useMutation({
    mutationFn: () => api.put(`/roles/${role.id}`, { permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onClose();
    }
  });

  function toggle(resource: Resource, action: "read" | "write", checked: boolean) {
    const key = `${resource}.${action}`;
    setPermissions((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
        if (action === "read") {
          next.delete(`${resource}.write`);
        }
      }
      if (action === "write" && checked) {
        next.add(`${resource}.read`);
      }
      return Array.from(next);
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={`Edit Permissions — ${role.name}`}>
      <div className="space-y-4">
        <div className="max-h-96 overflow-y-auto rounded-lg border border-line dark:border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line dark:border-white/10">
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-slate-400">
                  Resource
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-slate-400">
                  Read
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-slate-400">
                  Write
                </th>
              </tr>
            </thead>
            <tbody>
              {RESOURCES.map((resource) => (
                <tr key={resource} className="border-b border-line/70 last:border-0 dark:border-white/5">
                  <td className="px-4 py-2 capitalize">{resource}</td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={permissions.includes(`${resource}.read`)}
                      onChange={(event) => toggle(resource, "read", event.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={permissions.includes(`${resource}.write`)}
                      onChange={(event) => toggle(resource, "write", event.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {saveMutation.isError && (
          <p className="text-sm text-rose-600">{(saveMutation.error as Error).message}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function RolesPage() {
  const canWrite = usePermission("roles", "write");
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: () => api.get<Role[]>("/roles")
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Role and permission mapping across Super Admin through Vendor user types."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {(data ?? []).map((role) => {
          const isSuperAdmin = role.name === "Super Admin";
          return (
            <Card key={role.id}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{role.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge tone="success" icon={false}>{role.permissions.length} permissions</Badge>
                  {canWrite && !isSuperAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => setEditingRole(role)} aria-label="Edit permissions">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {isSuperAdmin ? (
                  <p className="text-sm text-ink/55 dark:text-slate-400">Full access</p>
                ) : (
                  role.permissions.map((permission) => (
                    <Badge key={permission} icon={false}>{permission}</Badge>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {editingRole && (
        <RolePermissionsModal
          role={editingRole}
          open={Boolean(editingRole)}
          onClose={() => setEditingRole(null)}
        />
      )}
    </div>
  );
}
