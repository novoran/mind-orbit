import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import schema from "./schema";

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth as any,
  {
    local: { schema },
    verbose: true,
  },
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
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
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

// For `auth` CLI
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
