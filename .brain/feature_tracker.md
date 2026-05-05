# Feature Tracker

*This document serves as the master checklist for all SRS requirements. The AI and developers should read this to instantly understand what is completed (🟢), active (🟡), and pending (🔵).*

## 1. Authentication & User Management
- [x] 🟢 Sign up / Login (Better Auth via `@convex-dev/better-auth`)
- [x] 🟢 Session management & User profile
- [ ] 🔵 Password reset workflows
- [ ] 🔵 Multi-factor authentication (MFA)

## 2. Multi-Tenant & Workspace Management
- [ ] 🔵 Create multiple workspaces, Join workspace, Invite members
- [ ] 🔵 Roles & permissions (Owner, Admin, Member, Client)
- [ ] 🔵 Workspace switching context in UI

## 3. Projects & Tasks Module (Idea Hub)
- [ ] 🟡 **ACTIVE**: Create, edit, and delete projects (`routes/_dashboard/idea-hub/index.tsx`)
- [ ] 🔵 Kanban board / Idea Cards visualizations
- [ ] 🔵 Task creation, assignment, and due dates
- [ ] 🔵 Subtasks, Labels, and Comments
- [ ] 🔵 File attachments (via Convex Storage)

## 4. Notes & Editor Module
- [ ] 🟡 **ACTIVE**: Rich text notes (`collaborative-editor.tsx` via Tiptap)
- [ ] 🔵 Real-time typing, cursors, and presence (Liveblocks/Yjs)
- [ ] 🔵 Folders / Document organization
- [ ] 🔵 Version history

## 5. AI Features (Convex Actions)
- [ ] 🔵 AI note summarize & AI content generation
- [ ] 🔵 AI planning and suggestions
- [ ] 🔵 AI query limits and usage tracking per workspace

## 6. Planner Module
- [ ] 🔵 Daily, Weekly, and Monthly planners & Reminders

## 7. Subscription, Billing, & Seats
- [ ] 🔵 Payment gateway integration (Stripe via Convex Actions)
- [ ] 🔵 Plan upgrades/downgrades, Seat management, Invoices

## 8. Real-Time, Notifications, & Integrations
- [ ] 🔵 In-app, Email (Resend), and Push notifications
- [ ] 🔵 Google Calendar, Slack, GitHub Integrations
