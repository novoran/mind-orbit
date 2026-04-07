import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import authConfig from "../auth.config";
import schema from "./schema";
import type { BetterAuthOrganization, BetterAuthUser } from "../types";

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth as typeof components.betterAuth,
  {
    local: { schema },
    verbose: false,
  },
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel> | MutationCtx) => {
  const db = "db" in ctx ? (ctx.db as MutationCtx["db"]) : undefined;
  return {
    appName: "Mind Orbit",
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "PLACEHOLDER",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "PLACEHOLDER",
      },
      microsoft: {
        clientId: process.env.MICROSOFT_CLIENT_ID || "PLACEHOLDER",
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "PLACEHOLDER",
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID || "PLACEHOLDER",
        clientSecret: process.env.APPLE_CLIENT_SECRET || "PLACEHOLDER",
      },
      slack: {
        clientId: process.env.SLACK_CLIENT_ID || "PLACEHOLDER",
        clientSecret: process.env.SLACK_CLIENT_SECRET || "PLACEHOLDER",
      },
    },
    trustedOrigins: [
      process.env.SITE_URL,
      process.env.WEB_SITE_URL,
      process.env.CLIENT_SITE_URL,
      process.env.ADMIN_SITE_URL,
      process.env.DOCS_SITE_URL,
      "http://localhost:3000",
      "http://localhost:3001",
    ].filter((origin): origin is string => !!origin),
    plugins: [
      convex({ authConfig }),
      organization({
        allowUserToCreateOrganization: true,
        creatorRole: "owner",
        dynamicAccessControl: {
          enabled: true,
        },
        schema: {
          organizationRole: {
            additionalFields: {
              type: {
                type: "string",
                defaultValue: "custom",
                required: false,
              },
            },
          },
        },
        teams: {
          enabled: true,
        },
        hooks: {
          organization: {
            beforeCreate: async ({
              data,
              user,
            }: {
              data: BetterAuthOrganization;
              user: BetterAuthUser;
            }) => {
              // Check for slug uniqueness

              if (db) {
                const existing = await db
                  .query("organization")
                  .withIndex("slug", (q: { eq: (f: "slug", v: string) => any }) => q.eq("slug", data.slug))
                  .first();

                if (existing) {
                  throw new Error("Slug already exists");
                }
              }

              return {
                data: {
                  ...data,
                  metadata: {
                    ...(data.metadata || {}),
                    plan: "free",
                  },
                },
              };
            },
          },
          afterCreate: async ({
            organization,
          }: {
            organization: BetterAuthOrganization;
          }) => {
            const systemRoles = [
              {
                role: "owner" as const,
                type: "system" as const,
                permissions: ["admin", "member", "invitation", "organization"],
              },
              {
                role: "admin" as const,
                type: "system" as const,
                permissions: ["admin", "member", "invitation"],
              },
              {
                role: "member" as const,
                type: "system" as const,
                permissions: ["member"],
              },
            ];

            if (db) {
              for (const r of systemRoles) {
                await db.insert("organizationRole", {
                  organizationId: organization.id,
                  role: r.role,
                  type: r.type,
                  permission: JSON.stringify(r.permissions),
                  createdAt: Date.now(),
                });
              }
            }
          },
        },
      }),
    ],
  } satisfies BetterAuthOptions;
};

// For `auth` CLI
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
