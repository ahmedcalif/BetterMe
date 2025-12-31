"use server";

import { getDB } from "@/db/client";
import { goals, steps } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import {
  calculateProgress,
  formatSeasonKey,
  getCurrentSeason,
} from "@/lib/utils";
import type {
  ActionResponse,
  CreateGoalInput,
  GoalWithSteps,
  Step,
  UpdateGoalInput,
} from "@/types";
import { and, desc, eq } from "drizzle-orm";
import { mightFail } from "might-fail";
import { revalidatePath } from "next/cache";

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
 * Get all goals for the current season
 */
export async function getCurrentSeasonGoals(): Promise<
  ActionResponse<{
    goals: GoalWithSteps[];
    season: ReturnType<typeof getCurrentSeason>;
  }>
> {
  try {
    const user = await requireAuth();
    const db = getDB();
    const currentSeason = getCurrentSeason();
    const seasonKey = formatSeasonKey(currentSeason.name, currentSeason.year);

    const { error, result } = await mightFail(
      db
        .select()
        .from(goals)
        .where(and(eq(goals.userId, user.dbId), eq(goals.season, seasonKey)))
        .orderBy(desc(goals.createdAt))
    );

    if (error) {
      return { success: false, error: "Failed to fetch goals" };
    }

    const goalsWithSteps = await enrichGoalsWithSteps(result || []);

    return {
      success: true,
      data: { goals: goalsWithSteps, season: currentSeason },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Get goals for a specific season
 */
export async function getGoalsBySeason(
  seasonKey: string
): Promise<ActionResponse<GoalWithSteps[]>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    const { error, result } = await mightFail(
      db
        .select()
        .from(goals)
        .where(and(eq(goals.userId, user.dbId), eq(goals.season, seasonKey)))
        .orderBy(desc(goals.createdAt))
    );

    if (error) {
      return { success: false, error: "Failed to fetch goals" };
    }

    const goalsWithSteps = await enrichGoalsWithSteps(result || []);

    return { success: true, data: goalsWithSteps };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Get a single goal by ID
 */
export async function getGoalById(
  goalId: string
): Promise<ActionResponse<GoalWithSteps>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    const { error, result } = await mightFail(
      db
        .select()
        .from(goals)
        .where(and(eq(goals.id, goalId), eq(goals.userId, user.dbId)))
        .limit(1)
    );

    if (error || !result || result.length === 0) {
      return { success: false, error: "Goal not found" };
    }

    const [goalWithSteps] = await enrichGoalsWithSteps(result);

    return { success: true, data: goalWithSteps };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Create a new goal
 */
export async function createGoal(
  input: CreateGoalInput
): Promise<ActionResponse<GoalWithSteps>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    // Validate input
    if (!input.title || input.title.trim().length < 3) {
      return { success: false, error: "Title must be at least 3 characters" };
    }

    if (input.title.length > 100) {
      return {
        success: false,
        error: "Title must be less than 100 characters",
      };
    }

    const currentSeason = getCurrentSeason();
    const season =
      input.season || formatSeasonKey(currentSeason.name, currentSeason.year);

    const { error, result } = await mightFail(
      db
        .insert(goals)
        .values({
          userId: user.dbId,
          title: input.title.trim(),
          description: input.description?.trim() || null,
          season,
        })
        .returning()
    );

    if (error || !result || result.length === 0) {
      return { success: false, error: "Failed to create goal" };
    }

    const newGoal = result[0];

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        id: newGoal.id,
        userId: newGoal.userId,
        title: newGoal.title,
        description: newGoal.description,
        season: newGoal.season,
        status: newGoal.status,
        createdAt: newGoal.createdAt,
        updatedAt: newGoal.updatedAt,
        completedAt: newGoal.completedAt,
        steps: [],
        progress: 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Update an existing goal
 */
export async function updateGoal(
  goalId: string,
  input: UpdateGoalInput
): Promise<ActionResponse<GoalWithSteps>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    // Verify ownership
    const { result: existing } = await mightFail(
      db
        .select()
        .from(goals)
        .where(and(eq(goals.id, goalId), eq(goals.userId, user.dbId)))
        .limit(1)
    );

    if (!existing || existing.length === 0) {
      return { success: false, error: "Goal not found" };
    }

    // Build update object
    const updates: Partial<typeof goals.$inferInsert> & { updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (input.title !== undefined) {
      if (input.title.trim().length < 3) {
        return { success: false, error: "Title must be at least 3 characters" };
      }
      updates.title = input.title.trim();
    }

    if (input.description !== undefined) {
      updates.description = input.description?.trim() || null;
    }

    if (input.status !== undefined) {
      updates.status = input.status;
      if (input.status === "completed") {
        updates.completedAt = new Date();
      }
    }

    const { error, result } = await mightFail(
      db.update(goals).set(updates).where(eq(goals.id, goalId)).returning()
    );

    if (error || !result || result.length === 0) {
      return { success: false, error: "Failed to update goal" };
    }

    const [updatedGoal] = await enrichGoalsWithSteps(result);

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/goals/${goalId}`);

    return { success: true, data: updatedGoal };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

/**
 * Delete a goal
 */
export async function deleteGoal(
  goalId: string
): Promise<ActionResponse<{ message: string }>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    // Verify ownership
    const { result: existing } = await mightFail(
      db
        .select()
        .from(goals)
        .where(and(eq(goals.id, goalId), eq(goals.userId, user.dbId)))
        .limit(1)
    );

    if (!existing || existing.length === 0) {
      return { success: false, error: "Goal not found" };
    }

    const { error } = await mightFail(
      db.delete(goals).where(eq(goals.id, goalId))
    );

    if (error) {
      return { success: false, error: "Failed to delete goal" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, data: { message: "Goal deleted" } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
