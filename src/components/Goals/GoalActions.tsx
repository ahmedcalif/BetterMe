"use client";

import { deleteGoal, updateGoal } from "@/app/goals/actions";
import { cn } from "@/lib/cn";
import { Check, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface GoalActionsProps {
  goalId: string;
  isCompleted: boolean;
}

export function GoalActions({ goalId, isCompleted }: GoalActionsProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      await updateGoal(goalId, { status: "completed" });
      setShowMenu(false);
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this goal? This cannot be undone.")) return;

    startTransition(async () => {
      const result = await deleteGoal(goalId);
      if (result.success) {
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={cn("btn-ghost p-2", isPending && "opacity-50")}
        disabled={isPending}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-soft-lg border border-bark-100 py-1 z-20">
            {!isCompleted && (
              <button
                onClick={handleComplete}
                disabled={isPending}
                className="w-full px-4 py-2 text-left text-sm text-bark-700 hover:bg-cream-100 flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Mark complete
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete goal
            </button>
          </div>
        </>
      )}
    </div>
  );
}
