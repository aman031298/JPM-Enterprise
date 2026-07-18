import type { PropsWithChildren } from "react";
import { ShieldOff } from "lucide-react";
import type { Resource } from "@shared/permissions";
import { usePermission } from "@/lib/use-permission";
import { Card } from "@/components/ui/card";

export function PermissionRoute({ resource, children }: PropsWithChildren<{ resource: Resource }>) {
  const canRead = usePermission(resource, "read");

  if (!canRead) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
            <ShieldOff className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-ink dark:text-white">Access restricted</h1>
          <p className="mt-2 text-sm text-ink/55 dark:text-slate-400">
            Your role does not have permission to view this module.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
