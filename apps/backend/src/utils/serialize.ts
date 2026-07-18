const enumLabelMap: Record<string, string> = {
  InProgress: "In Progress",
  AuditReview: "Audit Review"
};

export function serializeRecord<T>(value: T): T {
  if (value instanceof Date) {
    return value.toISOString() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeRecord(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, serializeRecord(entry)])
    ) as T;
  }

  if (typeof value === "string" && enumLabelMap[value]) {
    return enumLabelMap[value] as T;
  }

  return value;
}
