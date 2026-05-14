import { action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

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
 * Internal mutation to delete an idea from the database.
 */
export const removeIdea = internalMutation({
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

/**
 * Delete an idea and its associated Liveblocks room.
 */
export const remove = action({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // 1. Delete the idea from the database
    await ctx.runMutation(internal.ideas.removeIdea, { id: args.id });

    // 2. Delete the associated Liveblocks room
    const roomId = args.id;
    const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;

    if (!secretKey) {
      console.warn("LIVEBLOCKS_SECRET_KEY not set, skipping room deletion");
      return;
    }

    try {
      const response = await fetch(
        `https://api.liveblocks.io/v2/rooms/${roomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      if (!response.ok && response.status !== 404) {
        const error = await response.text();
        console.error(`Failed to delete Liveblocks room ${roomId}:`, error);
      }
    } catch (error) {
      console.error(`Error deleting Liveblocks room ${roomId}:`, error);
    }
  },
});
