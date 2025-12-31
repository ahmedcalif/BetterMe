import { CreateGoalButton, GoalCard, SeasonHeader } from "@/components/Goals";
import { EmptyState } from "@/components/ui";
import { requireAuth } from "@/lib/auth";
import { parseSeasonKey } from "@/lib/utils";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSeasonGoals } from "../actions";

interface SeasonPageProps {
  params: Promise<{
    seasonKey: string;
  }>;
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  // Require authentication
  await requireAuth();

  const { seasonKey } = await params;

  // Parse season key
  const season = parseSeasonKey(seasonKey);

  // Redirect if invalid season key
  if (!season) {
    redirect("/seasons");
  }

  const response = await getSeasonGoals(seasonKey);

  if (!response.success) {
    redirect("/seasons");
  }

  const goals = response.data || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <Link
        href="/seasons"
        className="inline-flex items-center gap-2 text-stone hover:text-bark transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Seasons
      </Link>

      <SeasonHeader season={season} goalCount={goals.length} />

      {goals.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal, i) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Leaf className="w-12 h-12 text-sage-400" />}
          title="No goals this season"
          description="Create your first goal for this season to get started."
        />
      )}

      <CreateGoalButton season={season} />
    </div>
  );
}
