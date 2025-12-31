"use client";

import type { Step } from "@/types";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { toggleStep, deleteStep } from "@/app/steps/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

interface StepItemProps {
  step: Step;
  index: number;
  totalSteps: number;
}

export function StepItem({ step }: StepItemProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    const response = await toggleStep(step.id);

    if (!response.success) {
      alert(response.error || "Failed to update step");
    }

    router.refresh();
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this step?")) {
      return;
    }

    setIsDeleting(true);
    const response = await deleteStep(step.id);

    if (response.success) {
      router.refresh();
    } else {
      alert(response.error || "Failed to delete step");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "group bg-white rounded-xl p-4 border-2 transition-all duration-200",
        step.isCompleted
          ? "border-green-200 bg-green-50/50"
          : "border-bark-100 hover:border-forest-300 hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2",
            step.isCompleted
              ? "bg-green-500 border-green-500"
              : "border-bark-300 hover:border-forest-500 hover:bg-forest-50"
          )}
          aria-label={step.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {step.isCompleted && (
            <Check className="w-full h-full text-white p-0.5" aria-hidden="true" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <p
              className={cn(
                "text-base font-medium transition-all",
                step.isCompleted
                  ? "text-bark-600 line-through"
                  : "text-bark-800"
              )}
            >
              {step.title}
            </p>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-shrink-0 p-2 text-bark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Delete step"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {step.completedAt && (
            <p className="text-xs text-green-600 mt-1">
              Completed {new Date(step.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
