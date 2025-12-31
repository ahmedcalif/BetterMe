import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="mb-6 transform transition-transform hover:scale-105">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-bark mb-3 text-center">
        {title}
      </h3>
      <p className="text-stone text-base max-w-md text-center leading-relaxed mb-8">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
