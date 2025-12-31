import { GoalRecord } from "@/db/schema";
import Link from "next/link";

interface ArchivedGoalCardProps {
  goal: GoalRecord;
}

export default function ArchivedGoalCard({ goal }: ArchivedGoalCardProps) {
  const isCompleted = goal.status === "completed";

  return (
    <Link href={`/goals?id=${goal.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-sage/20 p-5 hover:shadow-md transition-shadow h-full">
        {/* Status Badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {isCompleted ? (
              <>
                <svg
                  className="w-3 h-3"
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
                Completed
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
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
                Archived
              </>
            )}
          </span>
        </div>

        {/* Goal Title */}
        <h3 className="text-lg font-semibold text-bark mb-2 line-clamp-2">
          {goal.title}
        </h3>

        {/* Goal Description */}
        {goal.description && (
          <p className="text-sm text-stone line-clamp-3 mb-4">
            {goal.description}
          </p>
        )}

        {/* Completion Date */}
        {goal.completedAt && (
          <div className="text-xs text-stone flex items-center gap-1 mt-auto">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Completed {new Date(goal.completedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </Link>
  );
}
