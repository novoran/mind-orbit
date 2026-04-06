import { defineSchema } from "convex/server";
import { tables as betterAuthTables } from "./betterAuth/schema";

export default defineSchema({
  ...betterAuthTables,
  // Add your root project tables here
});
