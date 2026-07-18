import { hasPermission, type Action, type Resource } from "@shared/permissions";
import { useAuthStore } from "@/store/auth-store";

export function usePermission(resource: Resource, action: Action = "read") {
  const permissions = useAuthStore((state) => state.session?.user.permissions ?? []);
  return hasPermission(permissions, resource, action);
}

export function usePermissions() {
  return useAuthStore((state) => state.session?.user.permissions ?? []);
}
