# Mind Orbit - Project Context & Architecture

## 1. Project Vision
Mind Orbit is a multi-tenant, AI-powered productivity and project management platform designed for freelancers, teams, and organizations. It acts as a unified workspace combining task management, collaborative notes, client delivery, payments, and AI assistance.

## 2. Tech Stack & Architecture
Mind Orbit uses a **monorepo (TurboRepo)** structure and relies on a modern full-stack React architecture.
- **Frontend**: TanStack Start + TanStack Router, React, Tailwind CSS, Framer Motion, HugeIcons.
- **Backend/Database**: Convex (Backend-as-a-Service). Handles real-time DB, Queries, Mutations, and Actions.
- **Authentication**: Better Auth (`@convex-dev/better-auth`).
- **Editor/Real-time**: Tiptap integrated with Liveblocks (`@liveblocks/react-tiptap`).
- **Infrastructure Scope**: Workspaces (Teams) are the absolute boundary. All data, billing, and roles must be isolated per tenant in Convex schemas.

## 3. Development Guidelines
- **Data State**: Use Convex `useQuery`/`useMutation` for persistent state. Use Liveblocks for ephemeral multiplayer state (cursors, online presence). Local UI uses React hooks.
- **External APIs**: Stripe, Nebius AI, or Resend must be called via **Convex Actions**, as standard mutations must be deterministic.
- **Strict Tenant Isolation**: Every core Convex query MUST validate the `workspace_id` and the calling user's role.

## 4. High-Level Roadmap (Phases)
- **Phase 1 (MVP)**: Core Foundation (Monorepo setup, Auth, Convex Workspaces).
- **Phase 2 (MVP)**: Core Productivity (Real-time Editor, Idea Hub, Tasks).
- **Phase 3 (MVP)**: AI Integration & Planners.
- **Phase 4 (Phase 2)**: Freelancer Workflows (Client roles, Stripe Billing, Milestones).
- **Phase 5 (Phase 2)**: Polish & Plugins (Notifications, Integrations).
