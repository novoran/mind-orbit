import { Doc, Id } from "./_generated/dataModel";

/**
 * Represents an "Orbit" (traditionally an Organization).
 */
export type Orbit = Doc<"organization">;

/**
 * Role type for members within an Orbit.
 */
export type OrbitRole = "owner" | "admin" | "member" | string;

/**
 * An Orbit with the current user's role included.
 */
export interface OrbitWithRole extends Orbit {
  role: OrbitRole | null;
}

/**
 * Represents a user from the authentication system.
 */
export type AuthUser = Doc<"user">;

/**
 * User-specific settings and preferences.
 */
export type UserSettings = Doc<"userSettings">;

/**
 * A user merged with their settings.
 */
export interface UserWithSettings extends Partial<AuthUser> {
  settings: UserSettings | null;
  _exists: boolean;
  _id?: Id<"user">;
}

/**
 * Better Auth specific types for hooks
 */
export interface BetterAuthOrganization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: number;
  metadata?: any;
}

export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}
