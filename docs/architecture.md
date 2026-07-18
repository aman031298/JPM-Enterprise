# Architecture Notes

## Frontend

- React + Vite + TypeScript
- Tailwind CSS for styling
- Reusable component primitives inspired by shadcn/ui patterns
- React Router for application routing
- TanStack Query for API state
- Zustand for authentication and UI state
- React Hook Form + Zod on auth and settings forms
- Recharts for dashboard and reporting charts

## Backend

- Express + TypeScript
- Layered structure: routes, controllers, services, repositories, middlewares, utils, types
- JSON repository pattern around `/mock-data`
- Generic CRUD endpoints for master modules plus specialized dashboard, auth, reports, settings, and calendar endpoints

## Data Flow

1. Frontend requests module data from Express.
2. Services aggregate or filter JSON records.
3. Shared domain types keep naming and shapes aligned across the codebase.

## Phase 2 Upgrade Path

- Replace file repository with Prisma repositories
- Add JWT middleware in `middlewares`
- Move document metadata to persistent storage
- Add email notification services
