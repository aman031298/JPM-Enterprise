import fs from "node:fs";
import path from "node:path";

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? "./storage/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  uploadDir,
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "noreply@jpm-enterprise.demo",
  defaultNotificationEmail: process.env.DEFAULT_NOTIFICATION_EMAIL ?? "compliance@jpm-enterprise.demo"
};
