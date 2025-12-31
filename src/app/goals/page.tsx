import { getGoalById } from "@/app/goals/actions";
import { AddStepForm, GoalActions, StepItem } from "@/components/Goals";
import { ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatDate, getProgressMessage } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface GoalPageProps {
  params: Promise<{ goalId: string }>;
}

export default async function GoalPage({ params }: GoalPageProps) {
  const { goalId } = await params;
  const result = await getGoalById(goalId);

  if (!result.success || !result.data) {
    notFound();
  }

  const goal = result.data;
  const isCompleted = goal.status === "completed";
  const completedSteps = goal.steps.filter((s) => s.isCompleted).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-bark-500 hover:text-bark-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to goals
      </Link>

      {/* Goal details card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 text-xs font-medium mb-1">
                <Check className="w-3 h-3" />
                Completed
              </span>
            )}
            <h1
              className={cn(
                "text-2xl font-bold text-bark-800",
                isCompleted && "line-through opacity-60"
              )}
            >
              {goal.title}
            </h1>
            {goal.description && (
              <p className="text-bark-500 mt-2">{goal.description}</p>
            )}
          </div>

          <GoalActions goalId={goal.id} isCompleted={isCompleted} />
        </div>

        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-bark-500">
              {getProgressMessage(goal.progress)}
            </span>
            <span className="font-medium text-forest-600">
              {goal.progress}%
            </span>
          </div>
          <ProgressBar value={goal.progress} />
        </div>

        {/* Dates */}
        <div className="mt-4 pt-4 border-t border-bark-100 text-sm text-bark-400">
          Created {formatDate(goal.createdAt)}
          {goal.completedAt && (
            <span> • Completed {formatDate(goal.completedAt)}</span>
          )}
        </div>
      </div>

      {/* Steps card */}
      <div className="card">
        <h2 className="text-lg font-semibold text-bark-800 mb-4">
          Steps ({completedSteps}/{goal.steps.length})
        </h2>

        <div className="space-y-2">
          {goal.steps.map((step) => (
            <StepItem key={step.id} step={step} />
          ))}

          {goal.steps.length === 0 && (
            <p className="text-bark-400 text-center py-4">
              No steps yet. Add some to get started!
            </p>
          )}
        </div>

        {/* Add step form */}
        {!isCompleted && <AddStepForm goalId={goal.id} />}
      </div>
    </div>
  );
}
