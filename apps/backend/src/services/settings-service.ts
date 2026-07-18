import { prisma } from "../lib/prisma.js";
import { serializeRecord } from "../utils/serialize.js";

const DEFAULTS = {
  escalationMatrix: ["Compliance Officer", "Company Admin", "Super Admin"],
  complianceCategories: ["Statutory", "Safety", "Payroll", "Environment"],
  documentCategories: ["License", "Statutory", "Policy", "Evidence"],
  riskCategories: ["Regulatory", "Operational", "Third Party", "Security"]
};

function withMasters(settings: Record<string, unknown>) {
  const serialized = serializeRecord(settings) as Record<string, unknown>;
  return {
    ...serialized,
    masters: {
      "Compliance Categories": serialized.complianceCategories,
      "Document Categories": serialized.documentCategories,
      "Risk Categories": serialized.riskCategories,
      "Escalation Matrix": serialized.escalationMatrix
    }
  };
}

export class SettingsService {
  async getSettings() {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "settings-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          companyPolicy: "Enterprise compliance baseline",
          reminderWindowDays: 30,
          ...DEFAULTS
        }
      });
    }

    return withMasters(settings);
  }

  async updateSettings(payload: {
    companyPolicy?: string;
    reminderWindowDays?: number;
    complianceCategories?: string[];
    documentCategories?: string[];
    riskCategories?: string[];
    escalationMatrix?: string[];
  }) {
    const current = await prisma.settings.findFirst();
    const data: Record<string, unknown> = { updatedAt: new Date() };

    if (payload.companyPolicy !== undefined) data.companyPolicy = payload.companyPolicy;
    if (payload.reminderWindowDays !== undefined) data.reminderWindowDays = payload.reminderWindowDays;
    if (payload.complianceCategories !== undefined) data.complianceCategories = payload.complianceCategories;
    if (payload.documentCategories !== undefined) data.documentCategories = payload.documentCategories;
    if (payload.riskCategories !== undefined) data.riskCategories = payload.riskCategories;
    if (payload.escalationMatrix !== undefined) data.escalationMatrix = payload.escalationMatrix;

    const settings = current
      ? await prisma.settings.update({ where: { id: current.id }, data })
      : await prisma.settings.create({
          data: {
            id: "settings-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            companyPolicy: payload.companyPolicy ?? "Enterprise compliance baseline",
            reminderWindowDays: payload.reminderWindowDays ?? 30,
            complianceCategories: payload.complianceCategories ?? DEFAULTS.complianceCategories,
            documentCategories: payload.documentCategories ?? DEFAULTS.documentCategories,
            riskCategories: payload.riskCategories ?? DEFAULTS.riskCategories,
            escalationMatrix: payload.escalationMatrix ?? DEFAULTS.escalationMatrix
          }
        });

    return withMasters(settings);
  }
}
