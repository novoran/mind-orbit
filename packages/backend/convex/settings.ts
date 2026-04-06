import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_SETTINGS = {
  projectUpdates: true,
  milestoneReached: true,
  taskAssignments: true,
  newTeamMembers: false,
  language: "en-US",
  timezone: "Asia/Dhaka",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  weekStart: "monday",
  aiSummaries: true,
  onboardingCompleted: false,
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return settings;
  },
});

export const update = mutation({
  args: {
    projectUpdates: v.optional(v.boolean()),
    milestoneReached: v.optional(v.boolean()),
    taskAssignments: v.optional(v.boolean()),
    newTeamMembers: v.optional(v.boolean()),
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    dateFormat: v.optional(v.string()),
    timeFormat: v.optional(v.string()),
    weekStart: v.optional(v.string()),
    aiSummaries: v.optional(v.boolean()),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, args);
      return await ctx.db.get(existingSettings._id);
    } else {
      const newSettings = {
        ...DEFAULT_SETTINGS,
        ...args,
        userId,
      };
      const id = await ctx.db.insert("userSettings", newSettings);
      return await ctx.db.get(id);
    }
  },
});
