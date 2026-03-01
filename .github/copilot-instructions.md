# Copilot Instructions for Harfbase

This guide helps AI coding agents work productively in the Harfbase codebase. It summarizes architecture, workflows, and conventions unique to this project.

## Architecture Overview

- **Layered, Feature-Based Structure**: Code is organized by domain (blogs, editor, users) rather than technical layer. Frontend (`src/client`) and backend (`src/db`, `src/lib`, etc.) are clearly separated.
- **Next.js App Router**: Main entry is in `src/app/`. Pages and layouts live here, with API routes in `src/app/api/`.
- **Editor Feature**: Rich text editor lives in `src/client/features/editor/` with modular components, plugins, hooks, and context providers. See `README.md` in `image-node/` for data flow and component boundaries.
- **Repository Pattern**: Data access logic is isolated in `src/lib/repositories/`, keeping services clean and testable.
- **API as Contract**: Thin HTTP layer in `src/app/api/` delegates to backend services.

## Developer Workflows

- **Local Development**: Use `npm install` then `npm run dev` to start the Next.js server. Visit `http://localhost:3000`.
- **Build/Production**: Use `npm run build` then `npm start`.
- **Database**: Prisma schema in `prisma/schema.prisma`. Migrations in `prisma/migrations/`. Use Prisma CLI for DB changes.
- **Linting**: Run `npm run lint` (ESLint config in `eslint.config.mjs`).

## Project-Specific Conventions

- **Feature Boundaries**: Each feature (blogs, editor, profile) has its own directory under `src/client/features/` and `src/lib/repositories/`.
- **Editor Plugins**: Editor extensibility via plugins in `src/client/features/editor/plugins/`. Use context and hooks for UI state.
- **Shared UI**: Reusable components in `src/client/shared/ui/`.
- **Type Safety**: Shared types in `src/shared/types.ts`.
- **Image Handling**: See `image-node/README.md` for image component data flow and error handling.

## Integration Points

- **Prisma**: Database access via Prisma ORM. Schema and migrations in `prisma/`.
- **Next.js API Routes**: API endpoints in `src/app/api/` call backend services/repositories.
- **Custom Middleware**: Server utilities and middleware in `src/db/` and `src/lib/`.

## Examples

- To add a new blog feature, create UI in `src/client/features/blogs/`, business logic in `src/lib/services/post-service.ts`, and data access in `src/lib/repositories/post-repository.ts`.
- For editor extensions, add plugins to `src/client/features/editor/plugins/` and update context/hooks as needed.

## References

- Main project overview: [`README.md`](../../README.md)
- Editor feature details: [`image-node/README.md`](../src/client/features/editor/components/image-node/README.md)

---

If any section is unclear or missing, please provide feedback to improve these instructions.
