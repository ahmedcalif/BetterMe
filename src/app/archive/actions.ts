"use server";

import { getDB } from "@/db/client";
import { goals } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { and, eq, or } from "drizzle-orm";
import { mightFail } from "might-fail";

/**
 * Get all completed and archived goals for the current user
 */
export async function getArchivedGoals() {
  const user = await requireAuth();
  const db = getDB();

  const { error, result } = await mightFail(
    db
      .select()
      .from(goals)
      .where(
        and(
          eq(goals.userId, user.dbId),
          or(eq(goals.status, "completed"), eq(goals.status, "archived"))
        )
      )
      .orderBy(goals.completedAt)
  );

  if (error) {
    return {
      success: false,
      error: "Failed to fetch archived goals",
    };
  }

  return {
    success: true,
    data: result || [],
  };
}
