"use client";

import { createGoal } from "@/app/goals/actions";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { formatSeasonKey } from "@/lib/utils";
import type { Season } from "@/types";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";

interface CreateGoalButtonProps {
  season?: Season;
}

export function CreateGoalButton({ season }: CreateGoalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);

    startTransition(async () => {
      const result = await createGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        season: season ? formatSeasonKey(season.name, season.year) : undefined,
      });

      if (result.success) {
        setTitle("");
        setDescription("");
        setIsOpen(false);
      } else {
        setError(result.error || "Failed to create goal");
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setError(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 btn-primary rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 z-50"
        aria-label="Create new goal"
        title="Create new goal"
      >
        <Plus className="w-6 h-6" aria-hidden="true" />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Plant a new goal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="goal-title"
              className="block text-sm font-medium text-bark-700 mb-1.5"
            >
              What do you want to achieve?
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Learn to play guitar"
              className="input"
              autoFocus
              disabled={isPending}
            />
          </div>

          <div>
            <label
              htmlFor="goal-description"
              className="block text-sm font-medium text-bark-700 mb-1.5"
            >
              Why is this important? (optional)
            </label>
            <textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your motivation..."
              rows={3}
              className="input resize-none"
              disabled={isPending}
            />
          </div>

          {season && (
            <p className="text-sm text-bark-500">
              This goal will be added to{" "}
              <span className="font-medium text-forest-600">
                {season.label}
              </span>
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn-ghost flex-1"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isPending}
              className={cn("btn-primary flex-1", isPending && "opacity-50")}
            >
              {isPending ? "Creating..." : "Create Goal"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
