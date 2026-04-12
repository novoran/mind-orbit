import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/**
 * List all ideas for the current user and active organization.
 */
export const list = query({
  args: {
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    if (args.organizationId) {
      return await ctx.db
        .query("ideas")
        .withIndex("by_org", (q) => q.eq("organizationId", args.organizationId))
        .collect();
    }

    return await ctx.db
      .query("ideas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

/**
 * Get a single idea by ID.
 */
export const get = query({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new idea.
 */
export const create = mutation({
  args: {
    title: v.string(),
    organizationId: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const userId = identity.subject;

    const ideaId = await ctx.db.insert("ideas", {
      title: args.title,
      userId: userId,
      organizationId: args.organizationId,
      description: args.description,
      createdAt: Date.now(),
    });

    return ideaId;
  },
});

/**
 * Update an idea's metadata.
 */
export const update = mutation({
  args: {
    id: v.id("ideas"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      lastOpenedAt: Date.now(),
    });
  },
});

/**
 * Delete an idea.
 */
export const remove = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const idea = await ctx.db.get(args.id);
    if (!idea) throw new Error("Idea not found");

    if (idea.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
