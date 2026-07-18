import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { usePermission } from "@/lib/use-permission";

const settingsSchema = z.object({
  companyPolicy: z.string().min(5),
  reminderWindowDays: z.coerce.number().min(1).max(180)
});

type SettingsValues = z.infer<typeof settingsSchema>;

const masterFieldKey: Record<string, string> = {
  "Compliance Categories": "complianceCategories",
  "Document Categories": "documentCategories",
  "Risk Categories": "riskCategories",
  "Escalation Matrix": "escalationMatrix"
};

interface SettingsResponse extends SettingsValues {
  escalationMatrix: string[];
  masters: Record<string, string[]>;
}

export function SettingsPage() {
  const queryClient = useQueryClient();
  const canWrite = usePermission("settings", "write");
  const [newValueByGroup, setNewValueByGroup] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get<SettingsResponse>("/settings")
  });

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    values: data
      ? {
          companyPolicy: data.companyPolicy,
          reminderWindowDays: data.reminderWindowDays
        }
      : undefined
  });

  const mutation = useMutation({
    mutationFn: (values: SettingsValues) => api.put("/settings", values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] })
  });

  const masterMutation = useMutation({
    mutationFn: (payload: Record<string, string[]>) => api.put("/settings", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] })
  });

  function addMasterValue(group: string) {
    const fieldKey = masterFieldKey[group];
    const value = (newValueByGroup[group] ?? "").trim();
    if (!fieldKey || !value || !data) return;

    const current = data.masters[group] ?? [];
    if (current.includes(value)) return;

    masterMutation.mutate({ [fieldKey]: [...current, value] });
    setNewValueByGroup((prev) => ({ ...prev, [group]: "" }));
  }

  function removeMasterValue(group: string, value: string) {
    const fieldKey = masterFieldKey[group];
    if (!fieldKey || !data) return;

    const current = data.masters[group] ?? [];
    masterMutation.mutate({ [fieldKey]: current.filter((item) => item !== value) });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Masters"
        description="Reminder windows, escalation matrix, and master category configuration."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h3 className="text-base font-semibold">Settings</h3>
          <form className="mt-5 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <label className="block">
              <Label>Company Policy</Label>
              <Input disabled={!canWrite} {...form.register("companyPolicy")} />
            </label>
            <label className="block">
              <Label>Reminder Window (days)</Label>
              <Input type="number" disabled={!canWrite} {...form.register("reminderWindowDays")} />
            </label>
            {canWrite && (
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            )}
            {mutation.isSuccess && <p className="text-sm font-medium text-emerald-600">Settings saved.</p>}
          </form>
        </Card>
        <Card>
          <h3 className="text-base font-semibold">Masters</h3>
          <div className="mt-5 space-y-5">
            {Object.entries(data?.masters ?? {}).map(([group, values]) => (
              <div key={group}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-slate-500">{group}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {values.map((value) => (
                    <span
                      key={value}
                      className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink/75 dark:bg-white/10 dark:text-slate-300"
                    >
                      {value}
                      {canWrite && (
                        <button
                          type="button"
                          onClick={() => removeMasterValue(group, value)}
                          className="text-ink/40 hover:text-rose-600 dark:text-slate-500"
                          aria-label={`Remove ${value}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {canWrite && (
                  <form
                    className="mt-2 flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      addMasterValue(group);
                    }}
                  >
                    <Input
                      value={newValueByGroup[group] ?? ""}
                      onChange={(event) => setNewValueByGroup((prev) => ({ ...prev, [group]: event.target.value }))}
                      placeholder={`Add to ${group}...`}
                      className="h-8 text-xs"
                    />
                    <Button type="submit" variant="outline" size="sm" disabled={masterMutation.isPending}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
