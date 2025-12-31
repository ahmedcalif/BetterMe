"use server";

import { getDB } from "@/db/client";
import { goals, steps } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import type {
  ActionResponse,
  CreateStepInput,
  Step,
  UpdateStepInput,
} from "@/types";
import { and, eq } from "drizzle-orm";
import { mightFail } from "might-fail";
import { revalidatePath } from "next/cache";

async function verifyGoalOwnership(
  goalId: string,
  userId: string
): Promise<boolean> {
  const db = getDB();
  const { result } = await mightFail(
    db
      .select({ id: goals.id })
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
      .limit(1)
  );
  return !!(result && result.length > 0);
}

function toStep(record: typeof steps.$inferSelect): Step {
  return {
    id: record.id,
    goalId: record.goalId,
    title: record.title,
    isCompleted: record.isCompleted,
    order: record.order,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    completedAt: record.completedAt,
  };
}

export async function getStepsByGoalId(
  goalId: string
): Promise<ActionResponse<Step[]>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    const hasAccess = await verifyGoalOwnership(goalId, user.dbId);
    if (!hasAccess) {
      return { success: false, error: "Goal not found" };
    }

    const { error, result } = await mightFail(
      db
        .select()
        .from(steps)
        .where(eq(steps.goalId, goalId))
        .orderBy(steps.order)
    );

    if (error) {
      return { success: false, error: "Failed to fetch steps" };
    }

    return {
      success: true,
      data: (result || []).map(toStep),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function createStep(
  input: CreateStepInput
): Promise<ActionResponse<Step>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    if (!input.title || input.title.trim().length < 2) {
      return { success: false, error: "Title must be at least 2 characters" };
    }

    if (input.title.length > 200) {
      return {
        success: false,
        error: "Title must be less than 200 characters",
      };
    }

    const hasAccess = await verifyGoalOwnership(input.goalId, user.dbId);
    if (!hasAccess) {
      return { success: false, error: "Goal not found" };
    }

    let order = input.order;
    if (order === undefined) {
      const { result: existingSteps } = await mightFail(
        db
          .select({ order: steps.order })
          .from(steps)
          .where(eq(steps.goalId, input.goalId))
      );

      if (existingSteps && existingSteps.length > 0) {
        order = Math.max(...existingSteps.map((s) => s.order)) + 1;
      } else {
        order = 0;
      }
    }

    const { error, result } = await mightFail(
      db
        .insert(steps)
        .values({
          goalId: input.goalId,
          title: input.title.trim(),
          order,
        })
        .returning()
    );

    if (error || !result || result.length === 0) {
      return { success: false, error: "Failed to create step" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/goals/${input.goalId}`);

    return { success: true, data: toStep(result[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updateStep(
  stepId: string,
  input: UpdateStepInput
): Promise<ActionResponse<Step>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    const { result: existingStep } = await mightFail(
      db.select().from(steps).where(eq(steps.id, stepId)).limit(1)
    );

    if (!existingStep || existingStep.length === 0) {
      return { success: false, error: "Step not found" };
    }

    const hasAccess = await verifyGoalOwnership(
      existingStep[0].goalId,
      user.dbId
    );
    if (!hasAccess) {
      return { success: false, error: "Step not found" };
    }

    const updates: Partial<typeof steps.$inferInsert> & { updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (input.title !== undefined) {
      if (input.title.trim().length < 2) {
        return { success: false, error: "Title must be at least 2 characters" };
      }
      updates.title = input.title.trim();
    }

    if (input.order !== undefined) {
      updates.order = input.order;
    }

    if (input.isCompleted !== undefined) {
      updates.isCompleted = input.isCompleted;
      updates.completedAt = input.isCompleted ? new Date() : null;
    }

    const { error, result } = await mightFail(
      db.update(steps).set(updates).where(eq(steps.id, stepId)).returning()
    );

    if (error || !result || result.length === 0) {
      return { success: false, error: "Failed to update step" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/goals/${existingStep[0].goalId}`);

    return { success: true, data: toStep(result[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function toggleStep(
  stepId: string
): Promise<ActionResponse<Step>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    const { result: existingStep } = await mightFail(
      db.select().from(steps).where(eq(steps.id, stepId)).limit(1)
    );

    if (!existingStep || existingStep.length === 0) {
      return { success: false, error: "Step not found" };
    }

    const hasAccess = await verifyGoalOwnership(
      existingStep[0].goalId,
      user.dbId
    );
    if (!hasAccess) {
      return { success: false, error: "Step not found" };
    }

    const newCompleted = !existingStep[0].isCompleted;

    const { error, result } = await mightFail(
      db
        .update(steps)
        .set({
          isCompleted: newCompleted,
          completedAt: newCompleted ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(steps.id, stepId))
        .returning()
    );

    if (error || !result || result.length === 0) {
      return { success: false, error: "Failed to toggle step" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/goals/${existingStep[0].goalId}`);

    return { success: true, data: toStep(result[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deleteStep(
  stepId: string
): Promise<ActionResponse<{ message: string; goalId: string }>> {
  try {
    const user = await requireAuth();
    const db = getDB();

    const { result: existingStep } = await mightFail(
      db.select().from(steps).where(eq(steps.id, stepId)).limit(1)
    );

    if (!existingStep || existingStep.length === 0) {
      return { success: false, error: "Step not found" };
    }

    const goalId = existingStep[0].goalId;

    const hasAccess = await verifyGoalOwnership(goalId, user.dbId);
    if (!hasAccess) {
      return { success: false, error: "Step not found" };
    }

    const { error } = await mightFail(
      db.delete(steps).where(eq(steps.id, stepId))
    );

    if (error) {
      return { success: false, error: "Failed to delete step" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/goals/${goalId}`);

    return { success: true, data: { message: "Step deleted", goalId } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
