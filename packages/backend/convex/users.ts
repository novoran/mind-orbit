import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { UserWithSettings } from "./types";
import { Doc } from "./_generated/dataModel";

/**
 * Get current user with settings.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx): Promise<UserWithSettings | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const subject = identity.subject;
    const email = identity.email;

    // 1. Fetch settings (linked to the stable auth subject)
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", subject))
      .first();

    // 2. Try to find the user record aggressively
    let user = null;
    if (email) {
      user = await ctx.db.query("user").withIndex("email_name", (q) => q.eq("email", email)).first();
      if (!user) {
        user = await ctx.db.query("user").filter(q => q.eq(q.field("email"), email)).first();
      }
    }
    
    if (!user) {
      user = await ctx.db.query("user").withIndex("userId", (q) => q.eq("userId", subject)).first();
    }
    
    if (!user) {
      try {
        const doc = await ctx.db.get(subject as any);
        if (doc && "email" in doc) user = doc as Doc<"user">;
      } catch { /* skip */ }
    }

    // Return merged data. Even if 'user' is null, we return the settings 
    // so the frontend can display them alongside the session info.
    return {
      ...(user || {}),
      settings: settings ?? null,
      _exists: !!user, // Helper flag
    };
  },
});

/**
 * Generate a URL for uploading profile images.
 */
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return await ctx.storage.generateUploadUrl();
});

/**
 * Update the user's profile image using a storage ID.
 */
export const updateImage = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const subject = identity.subject;
    const email = identity.email;

    // Reuse aggressive finding logic
    let user = null;
    if (email) {
      user = await ctx.db.query("user").withIndex("email_name", (q) => q.eq("email", email)).first();
    }
    if (!user) {
      user = await ctx.db.query("user").withIndex("userId", (q) => q.eq("userId", subject)).first();
    }
    if (!user) {
      const userById = await ctx.db.get(subject as any);
      if (userById && "email" in userById) user = userById as Doc<"user">;
    }

    if (!user) throw new Error("User record not found in Convex. Please ensure your account is fully synchronized.");

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image not found in storage");

    await ctx.db.patch(user._id, {
      image: imageUrl,
    });

    return imageUrl;
  },
});
