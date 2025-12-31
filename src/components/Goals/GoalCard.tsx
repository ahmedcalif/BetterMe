import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { getProgressMessage } from "@/lib/utils";
import type { GoalWithSteps } from "@/types";
import { Check, CheckCircle2, ChevronRight, ListChecks } from "lucide-react";
import Link from "next/link";

interface GoalCardProps {
  goal: GoalWithSteps;
  className?: string;
  style?: React.CSSProperties;
}

export function GoalCard({ goal, className, style }: GoalCardProps) {
  const isCompleted = goal.status === "completed";
  const completedSteps = goal.steps.filter((s) => s.isCompleted).length;
  const totalSteps = goal.steps.length;

  return (
    <Link
      href={`/goals/${goal.id}`}
      className={cn(
        "block group bg-white rounded-xl p-6 border-2 border-sage/20 hover:border-forest/40 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2",
        className
      )}
      style={style}
      aria-label={`${goal.title} - ${completedSteps} of ${totalSteps} steps completed, ${goal.progress}% progress`}
      role="listitem"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium mb-2 border border-green-200">
              <Check className="w-3 h-3" aria-hidden="true" />
              Completed
            </span>
          )}
          <h3
            className={cn(
              "text-lg font-bold text-bark group-hover:text-forest transition-colors",
              isCompleted && "line-through opacity-60"
            )}
          >
            {goal.title}
          </h3>
        </div>
        <div className="flex-shrink-0 ml-3" aria-hidden="true">
          <div className="w-8 h-8 rounded-lg bg-sage/10 group-hover:bg-forest/10 flex items-center justify-center transition-colors">
            <ChevronRight className="w-5 h-5 text-sage group-hover:text-forest transition-colors" />
          </div>
        </div>
      </div>

      {goal.description && (
        <p className="text-sm text-stone line-clamp-2 mb-4 leading-relaxed">
          {goal.description}
        </p>
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center" aria-hidden="true">
            <ListChecks className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-bark" aria-label={`${completedSteps} of ${totalSteps} steps`}>
              {completedSteps}/{totalSteps}
            </div>
            <div className="text-xs text-stone">Steps</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center" aria-hidden="true">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-bark" aria-label={`${goal.progress} percent complete`}>
              {goal.progress}%
            </div>
            <div className="text-xs text-stone">Progress</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-forest">
            {getProgressMessage(goal.progress)}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={goal.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Goal progress: ${goal.progress} percent`}
        >
          <ProgressBar value={goal.progress} />
        </div>
      </div>
    </Link>
  );
}
