"use client";

import { createStep } from "@/app/steps/actions";
import { cn } from "@/lib/cn";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddStepFormProps {
  goalId: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function AddStepForm({ goalId, onCancel, onSuccess }: AddStepFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim() || isPending) return;

    setError(null);
    setIsPending(true);

    const result = await createStep({
      goalId,
      title: title.trim(),
    });

    if (result.success) {
      setTitle("");
      setIsPending(false);
      router.refresh();
      onSuccess?.();
    } else {
      setError(result.error || "Failed to create step");
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setError(null);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-forest-200 shadow-lg mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="step-title" className="block text-sm font-semibold text-bark-800 mb-2">
            New Step
          </label>
          <input
            id="step-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's the next step?"
            className="input"
            autoFocus
            disabled={isPending}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!title.trim() || isPending}
            className={cn("btn-primary flex-1", isPending && "opacity-50")}
          >
            <Plus className="w-5 h-5" />
            {isPending ? "Adding..." : "Add Step"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-ghost"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
