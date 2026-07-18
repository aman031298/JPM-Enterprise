import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { serializeRecord } from "../utils/serialize.js";
import { EmailService } from "./email-service.js";

export class NotificationService {
  private readonly emailService = new EmailService();

  async createAndSend(payload: {
    title: string;
    description: string;
    severity: "Info" | "Warning" | "Critical";
    recipient?: string;
  }) {
    const recipient = payload.recipient ?? process.env.DEFAULT_NOTIFICATION_EMAIL ?? "compliance@jpm-enterprise.demo";
    let emailDelivered = false;

    try {
      await this.emailService.sendMail({
        to: recipient,
        subject: payload.title,
        text: payload.description
      });
      emailDelivered = true;
    } catch {
      emailDelivered = false;
    }

    const notification = await prisma.notification.create({
      data: {
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        title: payload.title,
        description: payload.description,
        severity: payload.severity,
        emailDelivered,
        emailRecipient: recipient
      }
    });

    return serializeRecord(notification);
  }
}
