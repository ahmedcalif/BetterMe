import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1", className)}>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-bark-400 text-right">{clampedValue}%</div>
      )}
    </div>
  );
}
