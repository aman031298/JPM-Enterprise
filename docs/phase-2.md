# Phase 2 Setup

## Scope

This phase replaces JSON persistence with PostgreSQL + Prisma, adds JWT authentication, persists document uploads to local storage, and sends email notifications through SMTP or a JSON fallback transport.

## Environment

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL`
- `JWT_SECRET`
- `UPLOAD_DIR`
- `SMTP_*`

## Database

Run:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Notes

- The repository is configured for PostgreSQL in Prisma.
- Document uploads are stored locally under `apps/backend/storage/uploads` by default.
- If SMTP is not configured, emails are captured by Nodemailer's JSON transport so workflows still complete in development.
