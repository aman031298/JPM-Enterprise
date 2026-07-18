# JPM Enterprise Compliance Management System

Phase 1 monorepo prototype for a compliance management platform using mock JSON data with a React frontend and Express backend.

## Structure

- `apps/frontend`: React + Vite + TypeScript demo UI
- `apps/backend`: Express + TypeScript mock API
- `mock-data`: JSON-backed data sources for all modules
- `shared`: shared domain types and navigation config
- `docs`: project documentation

## Phase 1 Coverage

- Authentication
- Dashboard
- Company, Branch, Department management
- User, Role, Permission management
- Compliance library, calendar, and tasks
- Documents
- Audits
- Risks
- Vendors
- Reports and analytics
- Settings and masters

## Scripts

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

## Phase 2 Direction

The backend structure is prepared to replace JSON storage with PostgreSQL, Prisma, JWT authentication, file storage, and email notifications.
