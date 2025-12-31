import { cn } from "@/lib/cn";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-sage-200 border-t-forest-500",
          sizeClasses[size]
        )}
      />
    </div>
  );
}
