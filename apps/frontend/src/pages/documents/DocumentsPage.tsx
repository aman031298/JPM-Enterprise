import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, UploadCloud } from "lucide-react";
import type { DocumentRecord } from "@shared/domain";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input, Label } from "@/components/ui/input";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { usePermission } from "@/lib/use-permission";

const statusTone: Record<DocumentRecord["status"], "success" | "warning" | "danger"> = {
  Valid: "success",
  Expiring: "warning",
  Expired: "danger"
};

function EditDocumentModal({
  document,
  open,
  onClose
}: {
  document: DocumentRecord;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(document.title);
  const [category, setCategory] = useState(document.category);
  const [owner, setOwner] = useState(document.owner);
  const [expiryDate, setExpiryDate] = useState(document.expiryDate.slice(0, 10));
  const [status, setStatus] = useState<DocumentRecord["status"]>(document.status);

  useEffect(() => {
    if (!open) return;
    setTitle(document.title);
    setCategory(document.category);
    setOwner(document.owner);
    setExpiryDate(document.expiryDate.slice(0, 10));
    setStatus(document.status);
  }, [open, document]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.put(`/documents/${document.id}`, { title, category, owner, expiryDate, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onClose();
    }
  });

  return (
    <Modal open={open} onClose={onClose} title="Edit Document">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          saveMutation.mutate();
        }}
      >
        <label className="block">
          <Label>Title</Label>
          <Input required value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="block">
          <Label>Category</Label>
          <Input required value={category} onChange={(event) => setCategory(event.target.value)} />
        </label>
        <label className="block">
          <Label>Owner</Label>
          <Input required value={owner} onChange={(event) => setOwner(event.target.value)} />
        </label>
        <label className="block">
          <Label>Expiry Date</Label>
          <Input
            type="date"
            required
            value={expiryDate}
            onChange={(event) => setExpiryDate(event.target.value)}
          />
        </label>
        <label className="block">
          <Label>Status</Label>
          <Select
            required
            value={status}
            onChange={(event) => setStatus(event.target.value as DocumentRecord["status"])}
          >
            <option value="Valid">Valid</option>
            <option value="Expiring">Expiring</option>
            <option value="Expired">Expired</option>
          </Select>
        </label>
        {saveMutation.isError && (
          <p className="text-sm text-rose-600">{(saveMutation.error as Error).message}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function DocumentsPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("documents", "write");
  const [title, setTitle] = useState("Policy Acknowledgement");
  const [category, setCategory] = useState("Policy");
  const [owner, setOwner] = useState("Compliance Team");
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<DocumentRecord | null>(null);
  const [deleting, setDeleting] = useState<DocumentRecord | null>(null);

  const { data } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.get<DocumentRecord[]>("/documents")
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("owner", owner);
      formData.append("expiryDate", expiryDate);
      if (file) {
        formData.append("file", file);
      }

      return api.upload<DocumentRecord>("/documents", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setFile(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setDeleting(null);
    }
  });

  const actionColumns = canWrite
    ? [
        {
          key: "__actions" as Extract<keyof DocumentRecord, string>,
          label: "",
          render: (_value: unknown, row: DocumentRecord) => (
            <div className="flex justify-end gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => setEditing(row)} aria-label="Edit">
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
        title="Documents"
        description="Document register with persistent file storage, categories, and expiry tracking."
      />
      <Card>
        <h3 className="text-base font-semibold">Upload Document</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block">
            <Label>Title</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
          </label>
          <label className="block">
            <Label>Category</Label>
            <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
          </label>
          <label className="block">
            <Label>Owner</Label>
            <Input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Owner" />
          </label>
          <label className="block">
            <Label>Expiry Date</Label>
            <Input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} />
          </label>
          <label className="block">
            <Label>File</Label>
            <Input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="py-2" />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            <UploadCloud className="h-4 w-4" />
            {mutation.isPending ? "Uploading..." : "Upload Document"}
          </Button>
          {mutation.isError && <p className="text-sm text-rose-600">{mutation.error.message}</p>}
        </div>
      </Card>
      <DataTable
        title="Document Register"
        rows={data ?? []}
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "owner", label: "Owner" },
          { key: "expiryDate", label: "Expiry Date" },
          {
            key: "status",
            label: "Status",
            render: (value) => <Badge tone={statusTone[value as DocumentRecord["status"]] ?? "default"}>{String(value)}</Badge>
          },
          { key: "fileName", label: "File" },
          ...actionColumns
        ]}
      />

      {editing && (
        <EditDocumentModal document={editing} open={Boolean(editing)} onClose={() => setEditing(null)} />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete document"
        description="This action cannot be undone. Are you sure you want to delete this document?"
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
