"use server";

import { getDB } from "@/db/client";
import { goals, steps } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { calculateProgress, getCurrentSeason } from "@/lib/utils";
import type { GoalWithSteps, Step } from "@/types";
import { and, eq } from "drizzle-orm";
import { mightFail } from "might-fail";

/**
 * Helper to convert database records to typed objects with steps
 */
async function enrichGoalsWithSteps(
  goalRecords: (typeof goals.$inferSelect)[]
): Promise<GoalWithSteps[]> {
  const db = getDB();

  return Promise.all(
    goalRecords.map(async (goal) => {
      const { result: goalSteps = [] } = await mightFail(
        db
          .select()
          .from(steps)
          .where(eq(steps.goalId, goal.id))
          .orderBy(steps.order)
      );

      const typedSteps: Step[] = goalSteps.map((s) => ({
        id: s.id,
        goalId: s.goalId,
        title: s.title,
        isCompleted: s.isCompleted,
        order: s.order,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        completedAt: s.completedAt,
      }));

      return {
        id: goal.id,
        userId: goal.userId,
        title: goal.title,
        description: goal.description,
        season: goal.season,
        status: goal.status,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        completedAt: goal.completedAt,
        steps: typedSteps,
        progress: calculateProgress(typedSteps),
      };
    })
  );
}

/**
 * Get all goals for a specific season
 */
export async function getSeasonGoals(seasonKey: string) {
  const user = await requireAuth();
  const db = getDB();

  const { error, result } = await mightFail(
    db
      .select()
      .from(goals)
      .where(
        and(
          eq(goals.userId, user.dbId),
          eq(goals.season, seasonKey),
          eq(goals.status, "active")
        )
      )
      .orderBy(goals.createdAt)
  );

  if (error) {
    return {
      success: false,
      error: "Failed to fetch season goals",
    };
  }

  const goalsWithSteps = await enrichGoalsWithSteps(result || []);

  return {
    success: true,
    data: goalsWithSteps,
  };
}

/**
 * Get all unique seasons from user's goals
 */
export async function getUserSeasons() {
  const user = await requireAuth();
  const db = getDB();

  const { error, result } = await mightFail(
    db
      .selectDistinct({ season: goals.season })
      .from(goals)
      .where(eq(goals.userId, user.dbId))
      .orderBy(goals.season)
  );

  if (error) {
    return {
      success: false,
      error: "Failed to fetch seasons",
    };
  }

  const seasons = result || [];
  const currentSeason = getCurrentSeason();

  // Always include current season even if no goals yet
  if (!seasons.find((s) => s.season === currentSeason.key)) {
    seasons.push({ season: currentSeason.key });
  }

  return {
    success: true,
    data: seasons.map((s) => s.season),
  };
}
