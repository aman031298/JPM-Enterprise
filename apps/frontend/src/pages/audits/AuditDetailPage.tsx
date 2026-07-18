import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, UploadCloud } from "lucide-react";
import type { Audit, ChecklistItem, Evidence, Finding } from "@shared/domain";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { usePermission } from "@/lib/use-permission";

const severityTone: Record<Finding["severity"], "success" | "warning" | "danger"> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
  Critical: "danger"
};

export function AuditDetailPage() {
  const { auditId } = useParams<{ auditId: string }>();
  const queryClient = useQueryClient();
  const canWrite = usePermission("audits", "write");

  const [newChecklistLabel, setNewChecklistLabel] = useState("");
  const [newFindingDescription, setNewFindingDescription] = useState("");
  const [newFindingSeverity, setNewFindingSeverity] = useState<Finding["severity"]>("Medium");
  const [newEvidenceTitle, setNewEvidenceTitle] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const { data: audit } = useQuery({
    queryKey: ["audits", auditId],
    queryFn: () => api.get<Audit>(`/audits/${auditId}`),
    enabled: Boolean(auditId)
  });

  const { data: checklist } = useQuery({
    queryKey: ["audit-checklist", auditId],
    queryFn: () => api.get<ChecklistItem[]>(`/audits/${auditId}/checklist`),
    enabled: Boolean(auditId)
  });

  const { data: findings } = useQuery({
    queryKey: ["audit-findings", auditId],
    queryFn: () => api.get<Finding[]>(`/audits/${auditId}/findings`),
    enabled: Boolean(auditId)
  });

  const { data: evidence } = useQuery({
    queryKey: ["audit-evidence", auditId],
    queryFn: () => api.get<Evidence[]>(`/audits/${auditId}/evidence`),
    enabled: Boolean(auditId)
  });

  const addChecklistItem = useMutation({
    mutationFn: (label: string) => api.post(`/audits/${auditId}/checklist`, { label, done: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-checklist", auditId] });
      setNewChecklistLabel("");
    }
  });

  const toggleChecklistItem = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => api.put(`/audits/${auditId}/checklist/${id}`, { done }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-checklist", auditId] })
  });

  const deleteChecklistItem = useMutation({
    mutationFn: (id: string) => api.delete(`/audits/${auditId}/checklist/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-checklist", auditId] })
  });

  const addFinding = useMutation({
    mutationFn: () =>
      api.post(`/audits/${auditId}/findings`, {
        description: newFindingDescription,
        severity: newFindingSeverity,
        status: "Open"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-findings", auditId] });
      setNewFindingDescription("");
      setNewFindingSeverity("Medium");
    }
  });

  const resolveFinding = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Finding["status"] }) =>
      api.put(`/audits/${auditId}/findings/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-findings", auditId] })
  });

  const deleteFinding = useMutation({
    mutationFn: (id: string) => api.delete(`/audits/${auditId}/findings/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-findings", auditId] })
  });

  const addEvidence = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("title", newEvidenceTitle);
      if (evidenceFile) formData.append("file", evidenceFile);
      return api.upload(`/audits/${auditId}/evidence`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-evidence", auditId] });
      setNewEvidenceTitle("");
      setEvidenceFile(null);
    }
  });

  const deleteEvidence = useMutation({
    mutationFn: (id: string) => api.delete(`/audits/${auditId}/evidence/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-evidence", auditId] })
  });

  if (!audit) {
    return <div className="text-sm text-ink/60 dark:text-slate-400">Loading audit...</div>;
  }

  const completedCount = (checklist ?? []).filter((item) => item.done).length;

  return (
    <div className="space-y-6">
      <Link to="/dashboard/audits" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 dark:text-accent-300">
        <ArrowLeft className="h-4 w-4" />
        Back to Audits
      </Link>
      <PageHeader
        title={audit.title}
        description={`Auditor: ${audit.auditor}`}
        action={<Badge tone={audit.status === "Closed" ? "success" : "warning"}>{audit.status}</Badge>}
      />

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Checklist</h3>
          <span className="text-xs font-medium text-ink/50 dark:text-slate-400">
            {completedCount}/{(checklist ?? []).length} complete
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {(checklist ?? []).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 dark:border-white/10">
              <input
                type="checkbox"
                checked={item.done}
                disabled={!canWrite}
                onChange={(event) => toggleChecklistItem.mutate({ id: item.id, done: event.target.checked })}
                className="h-4 w-4 rounded border-line accent-accent"
              />
              <span className={`flex-1 text-sm ${item.done ? "text-ink/40 line-through dark:text-slate-500" : "text-ink dark:text-white"}`}>
                {item.label}
              </span>
              {canWrite && (
                <Button variant="ghost" size="sm" onClick={() => deleteChecklistItem.mutate(item.id)} aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                </Button>
              )}
            </div>
          ))}
          {(checklist ?? []).length === 0 && <p className="text-sm text-ink/50 dark:text-slate-400">No checklist items yet.</p>}
        </div>
        {canWrite && (
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (newChecklistLabel.trim()) addChecklistItem.mutate(newChecklistLabel.trim());
            }}
          >
            <Input
              placeholder="Add checklist item..."
              value={newChecklistLabel}
              onChange={(event) => setNewChecklistLabel(event.target.value)}
            />
            <Button type="submit" disabled={addChecklistItem.isPending}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </form>
        )}
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Findings</h3>
        <div className="mt-4 space-y-2.5">
          {(findings ?? []).map((finding) => (
            <div key={finding.id} className="rounded-lg border border-line p-3.5 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-ink dark:text-white">{finding.description}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={severityTone[finding.severity]}>{finding.severity}</Badge>
                  <Badge tone={finding.status === "Resolved" ? "success" : "default"}>{finding.status}</Badge>
                </div>
              </div>
              {canWrite && (
                <div className="mt-2.5 flex items-center gap-2">
                  {finding.status === "Open" ? (
                    <Button variant="outline" size="sm" onClick={() => resolveFinding.mutate({ id: finding.id, status: "Resolved" })}>
                      Mark resolved
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => resolveFinding.mutate({ id: finding.id, status: "Open" })}>
                      Reopen
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteFinding.mutate(finding.id)} aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {(findings ?? []).length === 0 && <p className="text-sm text-ink/50 dark:text-slate-400">No findings recorded.</p>}
        </div>
        {canWrite && (
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (newFindingDescription.trim()) addFinding.mutate();
            }}
          >
            <label className="block">
              <Label>Finding description</Label>
              <Input value={newFindingDescription} onChange={(event) => setNewFindingDescription(event.target.value)} />
            </label>
            <label className="block">
              <Label>Severity</Label>
              <Select value={newFindingSeverity} onChange={(event) => setNewFindingSeverity(event.target.value as Finding["severity"])}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Select>
            </label>
            <Button type="submit" disabled={addFinding.isPending}>
              <Plus className="h-4 w-4" />
              Add Finding
            </Button>
          </form>
        )}
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Evidence</h3>
        <div className="mt-4 space-y-2.5">
          {(evidence ?? []).map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-line p-3.5 dark:border-white/10">
              <div>
                <p className="text-sm font-medium text-ink dark:text-white">{item.title}</p>
                {item.fileName && <p className="text-xs text-ink/50 dark:text-slate-400">{item.fileName}</p>}
              </div>
              {canWrite && (
                <Button variant="ghost" size="sm" onClick={() => deleteEvidence.mutate(item.id)} aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                </Button>
              )}
            </div>
          ))}
          {(evidence ?? []).length === 0 && <p className="text-sm text-ink/50 dark:text-slate-400">No evidence uploaded.</p>}
        </div>
        {canWrite && (
          <form
            className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (newEvidenceTitle.trim()) addEvidence.mutate();
            }}
          >
            <Input placeholder="Evidence title" value={newEvidenceTitle} onChange={(event) => setNewEvidenceTitle(event.target.value)} />
            <Input type="file" onChange={(event) => setEvidenceFile(event.target.files?.[0] ?? null)} className="py-2" />
            <Button type="submit" disabled={addEvidence.isPending}>
              <UploadCloud className="h-4 w-4" />
              Upload
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
