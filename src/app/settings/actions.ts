"use server";

import { getDB } from "@/db/client";
import { users } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { mightFail } from "might-fail";
import { revalidatePath } from "next/cache";

export type Theme = "light" | "dark" | "nature";

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
}

export interface UpdateThemeInput {
  theme: Theme;
}

/**
 * Get current user's profile settings
 */
export async function getUserSettings() {
  const user = await requireAuth();
  const db = getDB();

  const { error, result } = await mightFail(
    db.select().from(users).where(eq(users.id, user.dbId)).limit(1)
  );

  if (error || !result || result.length === 0) {
    return {
      success: false,
      error: "Failed to fetch user settings",
    };
  }

  return {
    success: true,
    data: {
      email: result[0].email,
      firstName: result[0].first_name,
      lastName: result[0].last_name,
      picture: result[0].picture,
      theme: result[0].theme as Theme,
    },
  };
}

/**
 * Update user profile (name)
 */
export async function updateProfile(input: UpdateProfileInput) {
  const user = await requireAuth();
  const db = getDB();

  const updateData: Partial<typeof users.$inferInsert> = {};

  if (input.firstName !== undefined) {
    updateData.first_name = input.firstName.trim() || null;
  }

  if (input.lastName !== undefined) {
    updateData.last_name = input.lastName.trim() || null;
  }

  const { error } = await mightFail(
    db.update(users).set(updateData).where(eq(users.id, user.dbId))
  );

  if (error) {
    return {
      success: false,
      error: "Failed to update profile",
    };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Profile updated successfully",
  };
}

/**
 * Update user theme preference
 */
export async function updateTheme(input: UpdateThemeInput) {
  const user = await requireAuth();
  const db = getDB();

  const { error } = await mightFail(
    db.update(users).set({ theme: input.theme }).where(eq(users.id, user.dbId))
  );

  if (error) {
    return {
      success: false,
      error: "Failed to update theme",
    };
  }

  revalidatePath("/settings");

  return {
    success: true,
    message: "Theme updated successfully",
  };
}

/**
 * Delete user account and all associated data
 * WARNING: This is irreversible
 */
export async function deleteAccount() {
  const user = await requireAuth();
  const db = getDB();

  // Due to cascade delete, this will also delete all goals and steps
  const { error } = await mightFail(
    db.delete(users).where(eq(users.id, user.dbId))
  );

  if (error) {
    return {
      success: false,
      error: "Failed to delete account",
    };
  }

  return {
    success: true,
    message: "Account deleted successfully",
  };
}
