import ArchivedGoalCard from "@/components/Archive/ArchivedGoalCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getArchivedGoals } from "./actions";

export default async function ArchivePage() {
  // Require authentication
  await requireAuth();

  // Get archived goals
  const response = await getArchivedGoals();

  if (!response.success) {
    redirect("/dashboard");
  }

  const archivedGoals = response.data || [];

  // Group by season
  const goalsBySeason = archivedGoals.reduce((acc, goal) => {
    const season = goal.season;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(goal);
    return acc;
  }, {} as Record<string, typeof archivedGoals>);

  const seasons = Object.keys(goalsBySeason).sort().reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bark mb-2">Archive</h1>
        <p className="text-stone">
          View your completed and archived goals from past seasons
        </p>
      </div>

      {archivedGoals.length === 0 ? (
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
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          }
          title="No archived goals yet"
          description="Complete or archive goals from your dashboard to see them here"
          action={
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-cream rounded-lg hover:bg-forest/90 transition-colors"
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
              Back to Dashboard
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {seasons.map((season) => {
            const seasonGoals = goalsBySeason[season];
            const completedCount = seasonGoals.filter(
              (g) => g.status === "completed"
            ).length;
            const archivedCount = seasonGoals.filter(
              (g) => g.status === "archived"
            ).length;

            return (
              <div key={season}>
                {/* Season Header */}
                <div className="mb-4 pb-2 border-b border-sage/20">
                  <h2 className="text-xl font-semibold text-bark capitalize">
                    {season.replace("_", " ")}
                  </h2>
                  <p className="text-sm text-stone">
                    {completedCount} completed, {archivedCount} archived
                  </p>
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seasonGoals.map((goal) => (
                    <ArchivedGoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
