import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tables as betterAuthTables } from "./betterAuth/schema";

export default defineSchema({
  ...betterAuthTables,
  // Add your root project tables here
  userSettings: defineTable({
    userId: v.string(), // Links to Better-Auth user table String ID

    // Notifications
    projectUpdates: v.boolean(),
    milestoneReached: v.boolean(),
    taskAssignments: v.boolean(),
    newTeamMembers: v.boolean(),

    // Preferences
    language: v.string(),
    timezone: v.string(),
    dateFormat: v.string(),
    timeFormat: v.string(),
    weekStart: v.string(),
    aiSummaries: v.boolean(),

    // Profile
    bio: v.optional(v.string()),
    tagline: v.optional(v.string()),

    // Onboarding
    onboardingCompleted: v.boolean(),
  }).index("by_user", ["userId"]),

  ideas: defineTable({
    title: v.string(),
    userId: v.string(),
    organizationId: v.optional(v.string()), // For multi-tenancy
    description: v.optional(v.string()),
    lastOpenedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["organizationId"]),
});
