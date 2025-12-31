import { getCurrentSeasonGoals } from "@/app/goals/actions";
import StepsList from "@/components/Steps/StepsList";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireAuth } from "@/lib/auth";
import type { GoalWithSteps, Step } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StepsPage() {
  await requireAuth();

  const response = await getCurrentSeasonGoals();

  if (!response.success) {
    redirect("/dashboard");
  }

  const { goals } = response.data || { goals: [] };

  const allSteps = goals.flatMap((goal: GoalWithSteps) =>
    goal.steps.map((step: Step) => ({
      ...step,
      goalId: goal.id,
      goalTitle: goal.title,
    }))
  );

  const completedSteps = allSteps.filter((s) => s.isCompleted);
  const pendingSteps = allSteps.filter((s) => !s.isCompleted);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bark mb-2">All Steps</h1>
        <p className="text-stone">
          Overview of all steps across your current season goals
        </p>
      </div>

      {allSteps.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-16 h-16 text-sage"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          title="No steps yet"
          description="Create goals and add steps to see them here"
          action={
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-cream rounded-lg hover:bg-forest/90 transition-colors"
            >
              Go to Dashboard
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-sage/20 p-4">
              <div className="text-2xl font-bold text-bark">
                {allSteps.length}
              </div>
              <div className="text-sm text-stone">Total Steps</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-sage/20 p-4">
              <div className="text-2xl font-bold text-green-600">
                {completedSteps.length}
              </div>
              <div className="text-sm text-stone">Completed</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-sage/20 p-4">
              <div className="text-2xl font-bold text-orange-600">
                {pendingSteps.length}
              </div>
              <div className="text-sm text-stone">Pending</div>
            </div>
          </div>

          {pendingSteps.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-bark mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pending ({pendingSteps.length})
              </h2>
              <StepsList steps={pendingSteps} />
            </div>
          )}

          {completedSteps.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-bark mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Completed ({completedSteps.length})
              </h2>
              <StepsList steps={completedSteps} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
