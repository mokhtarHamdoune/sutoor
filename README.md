# Harfbase

Harfbase is a lightweight web application for writing and publishing personal blogs and long-form content. The project focuses on building a modern text editor and an opinionated feature set for composing, formatting, and publishing posts with a pleasant UX.

## Purpose

- Provide a focused editor experience for writers to compose and publish personal blogs.
- Ship a small, modular codebase where each feature (editor, blogs, profile, navigation) lives in its own boundary.
- Prototype advanced editor features (floating toolbar, selection tracking, plugins) that can evolve into a rich content platform.

## Project Structure

This project follows a **layered architecture** with clear separation between frontend and backend concerns, making it easy to maintain and scale.

```
src/
├── app/                          # Next.js App Router
│   ├── (web)/                    # Frontend pages and routes
│   └── api/                      # API endpoints (thin layer)
│
├── client/                       # Frontend layer
│   ├── features/                 # Domain-specific UI features
│   │   ├── blogs/                # Blog listing, cards, etc.
│   │   ├── editor/               # Rich text editor
│   │   └── profile/              # User profile UI
│   └── shared/                   # Shared client-side code
│       ├── hooks/                # Custom React hooks
│       └── components/           # Reusable UI components
│
├── server/                       # Backend layer (services & data access)
│   ├── features/                 # Domain-specific business logic
│   │   ├── blogs/
│   │   │   ├── blogs.service.ts      # Business logic
│   │   │   ├── blogs.repository.ts   # Data access
│   │   │   └── blogs.types.ts        # Backend types
│   │   └── users/
│   └── common/                   # Server utilities
│       ├── db.ts                 # Database connection
│       └── middleware/           # Custom middleware
│
├── shared/                       # Shared between client & server
│   └── types/                    # Type definitions, DTOs, contracts
│
└── db/                           # Database layer
    ├── migrations/               # Database migrations
    └── schema.prisma             # Database schema definition
```

### Architecture Principles

- **Separation of Concerns**: Frontend (`client/`) and backend (`server/`) are clearly separated, making it easy to extract backend to a dedicated server in the future if needed.
- **Feature-Based Organization**: Related code is grouped by domain (blogs, editor, users) rather than by technical layer.
- **Repository Pattern**: Data access logic is isolated in repository files, keeping services clean and testable.
- **API as Contract**: The `app/api/` folder acts as a thin HTTP layer that delegates to server services.

### Key Files

- `package.json` — Scripts and dependencies
- `next.config.ts` — Next.js configuration
- `tsconfig.json` — TypeScript configuration
- `eslint.config.mjs` — ESLint rules

## How to run (local development)

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open http://localhost:3000 in your browser.

Common scripts (from `package.json`):

- `dev` — run Next.js in development mode.
- `build` — build for production.
- `start` — start the production server after build.

If you use yarn or pnpm, use the corresponding install/run commands.

## What we have right now (high level)

- A Next.js app scaffold and global layout.
- A modular `editor` feature with:
  - A content-editable component for rich text editing.
  - Floating toolbar that appears around text selection.
  - Selection tracking utilities and hooks to position UI elements.
  - A small set of toolbar buttons / tools (see `src/features/editor/components/toolbar`).
- Navigation/header and other basic pages (home, profile placeholders).
- Shared UI components (`textarea`, navigation menu) and utility helpers.

Explore `src/features/editor` to see the editor implementation and `src/shared` for reusable components.

## Text editor roadmap / planned features

Short-term ideas (next milestones):

- Improve formatting tools: bold, italic, lists, code blocks, headings, block quotes.
- Add markdown import/export and HTML sanitization.
- Autosave/draft support and local draft persistence.
- Image upload / drag-and-drop support and basic media embedding.

Longer-term / research ideas:

- Collaborative editing (CRDT or OT) for real-time multi-user editing.
- Plugin system for third-party extensions and custom block types.
- Version history / document revisions and simple comments.
- Supporting right to left langueges like Arabic
