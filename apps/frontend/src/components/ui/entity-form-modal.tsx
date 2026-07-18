import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Input, Label } from "./input";
import { Select } from "./select";
import { Button } from "./button";

export type FieldType = "text" | "number" | "date" | "select" | "textarea";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
}

interface EntityFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
  title: string;
  fields: FieldConfig[];
  initialValues?: object | null;
  isPending?: boolean;
  errorMessage?: string | null;
}

function toInputValue(value: unknown, type: FieldType) {
  if (value === undefined || value === null) return "";
  if (type === "date" && typeof value === "string") return value.slice(0, 10);
  return String(value);
}

export function EntityFormModal({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  initialValues,
  isPending,
  errorMessage
}: EntityFormModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const source = (initialValues ?? {}) as Record<string, unknown>;
    const next: Record<string, string> = {};
    for (const field of fields) {
      next[field.key] = toInputValue(source[field.key], field.type);
    }
    setValues(next);
  }, [open, initialValues, fields]);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.key] ?? "";
      payload[field.key] = field.type === "number" ? Number(raw) : raw;
    }
    onSubmit(payload);
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.key} className="block">
            <Label>{field.label}</Label>
            {field.type === "select" ? (
              <Select
                required={field.required}
                value={values[field.key] ?? ""}
                onChange={(event) => handleChange(field.key, event.target.value)}
              >
                <option value="" disabled>
                  Select {field.label.toLowerCase()}
                </option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                required={field.required}
                value={values[field.key] ?? ""}
                onChange={(event) => handleChange(field.key, event.target.value)}
              />
            )}
          </label>
        ))}
        {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
