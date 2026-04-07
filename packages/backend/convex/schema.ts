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
});
