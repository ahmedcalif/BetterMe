import { getCurrentSeasonGoals } from "@/app/goals/actions";
import DashboardContent from "@/components/Dashboard/DashboardContent";

export default async function DashboardPage() {
  const result = await getCurrentSeasonGoals();

  if (!result.success || !result.data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-bark mb-2">
            Something went wrong
          </h2>
          <p className="text-stone">{result.error || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  const { goals, season } = result.data;

  return <DashboardContent goals={goals} season={season} />;
}
