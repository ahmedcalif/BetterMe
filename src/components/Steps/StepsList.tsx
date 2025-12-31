import Link from "next/link";

interface Step {
  id: string;
  title: string;
  isCompleted: boolean;
  goalId: string;
  goalTitle: string;
  completedAt: Date | null;
}

interface StepsListProps {
  steps: Step[];
}

export default function StepsList({ steps }: StepsListProps) {
  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <Link
          key={step.id}
          href={`/goals?id=${step.goalId}`}
          className="block bg-white rounded-lg shadow-sm border border-sage/20 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className="mt-0.5">
              {step.isCompleted ? (
                <div className="w-5 h-5 rounded border-2 border-green-600 bg-green-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded border-2 border-sage" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium mb-1 ${
                  step.isCompleted ? "text-stone line-through" : "text-bark"
                }`}
              >
                {step.title}
              </p>
              <div className="flex items-center gap-2 text-sm text-stone">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span className="truncate">{step.goalTitle}</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-sage"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
