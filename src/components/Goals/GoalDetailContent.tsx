"use client";

import type { GoalWithSteps } from "@/types";
import {
  Calendar,
  CheckCircle2,
  ListChecks,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Check,
} from "lucide-react";
import { StepItem } from "./StepItem";
import { AddStepForm } from "./AddStepForm";
import { parseSeasonKey } from "@/lib/utils";
import { useState } from "react";
import { deleteGoal, updateGoal } from "@/app/goals/actions";
import { useRouter } from "next/navigation";

interface GoalDetailContentProps {
  goal: GoalWithSteps;
}

export function GoalDetailContent({ goal }: GoalDetailContentProps) {
  const router = useRouter();
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const season = parseSeasonKey(goal.season);
  const completedSteps = goal.steps.filter((s) => s.isCompleted).length;
  const totalSteps = goal.steps.length;
  const isCompleted = goal.status === "completed";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    const response = await deleteGoal(goal.id);

    if (response.success) {
      router.push("/dashboard");
    } else {
      alert(response.error || "Failed to delete goal");
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    const newStatus = isCompleted ? "active" : "completed";
    const response = await updateGoal(goal.id, { status: newStatus });

    if (!response.success) {
      alert(response.error || "Failed to update goal");
    }
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Goal Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-600 via-forest-500 to-sage-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              {isCompleted && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold mb-4 ring-2 ring-white/30">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Completed
                </span>
              )}
              {season && (
                <p className="text-white/80 text-sm md:text-base mb-2 font-medium">
                  {season.label}
                </p>
              )}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {goal.title}
              </h1>
            </div>
            <div className="flex-shrink-0">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center ring-2 ring-white/20"
                aria-hidden="true"
              >
                <Target className="w-7 h-7 md:w-8 md:h-8" />
              </div>
            </div>
          </div>

          {goal.description && (
            <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-3xl">
              {goal.description}
            </p>
          )}
        </div>

        {/* Decorative elements */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-sage-400/20 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72 bg-forest-400/20 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"
          aria-hidden="true"
        />
      </section>

      {/* Statistics Cards */}
      <section aria-label="Goal statistics">
        <h2 className="sr-only">Goal Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md"
                aria-hidden="true"
              >
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-bark-800 tabular-nums">
                {totalSteps}
              </div>
            </div>
            <p className="text-sm font-medium text-bark-600">Total Steps</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md"
                aria-hidden="true"
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-bark-800 tabular-nums">
                {completedSteps}
              </div>
            </div>
            <p className="text-sm font-medium text-bark-600">Completed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md"
                aria-hidden="true"
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-bark-800 tabular-nums">
                {goal.progress}%
              </div>
            </div>
            <p className="text-sm font-medium text-bark-600">Progress</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md"
                aria-hidden="true"
              >
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-bold text-bark-800">
                {totalSteps - completedSteps}
              </div>
            </div>
            <p className="text-sm font-medium text-bark-600">Remaining</p>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      {totalSteps > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-bark-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-bark-800">Overall Progress</h2>
            <span className="text-2xl font-bold text-forest-600 tabular-nums">
              {goal.progress}%
            </span>
          </div>
          <div
            className="h-4 bg-sage-100 rounded-full overflow-hidden ring-1 ring-sage-200"
            role="progressbar"
            aria-valuenow={goal.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall progress: ${goal.progress} percent complete`}
          >
            <div
              className="h-full bg-gradient-to-r from-sage-400 via-forest-500 to-forest-600 rounded-full transition-all duration-700 shadow-lg"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </section>
      )}

      {/* Steps Section */}
      <section aria-label="Goal steps">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-bark-800 tracking-tight">
              Steps
            </h2>
            <p className="text-bark-600 text-sm md:text-base mt-1">
              {totalSteps === 0
                ? "Add steps to break down your goal"
                : `${completedSteps} of ${totalSteps} completed`}
            </p>
          </div>
          {!isAddingStep && (
            <button
              onClick={() => setIsAddingStep(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Step</span>
            </button>
          )}
        </div>

        {/* Add Step Form */}
        {isAddingStep && (
          <AddStepForm
            goalId={goal.id}
            onCancel={() => setIsAddingStep(false)}
            onSuccess={() => setIsAddingStep(false)}
          />
        )}

        {/* Steps List */}
        {totalSteps > 0 ? (
          <div className="space-y-3">
            {goal.steps.map((step, index) => (
              <StepItem
                key={step.id}
                step={step}
                index={index}
                totalSteps={totalSteps}
              />
            ))}
          </div>
        ) : (
          !isAddingStep && (
            <div className="bg-sage-50 rounded-2xl p-12 text-center border border-sage-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-200 to-forest-200 flex items-center justify-center mx-auto mb-4">
                <ListChecks className="w-8 h-8 text-forest-600" />
              </div>
              <h3 className="text-lg font-bold text-bark-800 mb-2">
                No steps yet
              </h3>
              <p className="text-bark-600 mb-6 max-w-md mx-auto">
                Break down your goal into actionable steps to track your progress.
              </p>
              <button
                onClick={() => setIsAddingStep(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                Add First Step
              </button>
            </div>
          )
        )}
      </section>

      {/* Actions */}
      <section className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-bark-200">
        <button
          onClick={handleToggleComplete}
          className="btn-secondary flex-1"
        >
          {isCompleted ? (
            <>
              <Target className="w-5 h-5" />
              Mark as Active
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Mark as Completed
            </>
          )}
        </button>
        <button className="btn-ghost">
          <Edit className="w-5 h-5" />
          Edit Goal
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn-danger"
        >
          <Trash2 className="w-5 h-5" />
          {isDeleting ? "Deleting..." : "Delete Goal"}
        </button>
      </section>
    </div>
  );
}
