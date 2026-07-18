import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transport = env.smtpHost
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined
    })
  : nodemailer.createTransport({ jsonTransport: true });

export class EmailService {
  async sendMail({ to, subject, text }: { to: string; subject: string; text: string }) {
    const info = await transport.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      text
    });

    return info;
  }
}
