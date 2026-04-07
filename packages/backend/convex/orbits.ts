import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Orbit, OrbitWithRole } from "./types";

/**
 * Get the active orbit for the current user session.
 */
export const activeOrbit = query({
  args: {},
  handler: async (ctx): Promise<OrbitWithRole | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Find the current session to get the active organization
    const session = await ctx.db
      .query("session")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .order("desc") // Get the most recent session
      .first();

    if (!session || !session.activeOrganizationId) return null;

    const organization = await ctx.db
      .query("organization")
      .withIndex("slug", (q) => q.eq("slug", session.activeOrganizationId as string))
      .first();

    if (!organization) return null;

    // Get the user's role in this organization
    const member = await ctx.db
      .query("member")
      .withIndex("organizationId", (q) => q.eq("organizationId", organization.slug))
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    return {
      ...organization,
      role: member?.role ?? null,
    };
  },
});

/**
 * List all orbits (organizations) the current user belongs to.
 */
export const listMyOrbits = query({
  args: {},
  handler: async (ctx): Promise<OrbitWithRole[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const memberships = await ctx.db
      .query("member")
      .withIndex("userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const organizations = [];
    for (const membership of memberships) {
      const org = await ctx.db
        .query("organization")
        .withIndex("slug", (q) => q.eq("slug", membership.organizationId))
        .first();
      if (org) {
        organizations.push({
          ...org,
          role: membership.role,
        });
      }
    }

    return organizations;
  },
});

/**
 * List teams for a specific organization.
 */
export const listTeams = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const teams = await ctx.db
      .query("team")
      .withIndex("organizationId", (q) => q.eq("organizationId", args.organizationId))
      .collect();
    return teams;
  },
});
