"use client";

import { CreateGoalButton, GoalCard } from "@/components/Goals";
import { EmptyState } from "@/components/ui";
import type { GoalWithSteps, Season } from "@/types";
import {
  Calendar,
  CheckCircle2,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface DashboardContentProps {
  goals: GoalWithSteps[];
  season: Season;
}

export default function DashboardContent({
  goals,
  season,
}: DashboardContentProps) {
  // Calculate statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const allSteps = goals.flatMap((g) => g.steps);
  const totalSteps = allSteps.length;
  const completedSteps = allSteps.filter((s) => s.isCompleted).length;
  const overallProgress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Get goals with recent activity
  const activeGoals = goals.filter((g) => g.status === "active");
  const goalsWithProgress = activeGoals.filter((g) => g.progress > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-forest-600 via-forest-500 to-sage-600 p-8 md:p-12 lg:p-16 text-white shadow-2xl"
        aria-label="Dashboard overview"
      >
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center ring-2 ring-white/20"
              aria-hidden="true"
            >
              <Target className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Welcome back
              </h1>
              <p className="text-white/90 text-base md:text-lg mt-2 font-medium">
                {season.label}
              </p>
            </div>
          </div>

          {totalGoals > 0 ? (
            <div className="mt-8 space-y-4">
              <p className="text-xl md:text-2xl text-white/95 font-medium">
                Making progress on {totalGoals}{" "}
                {totalGoals === 1 ? "goal" : "goals"}
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="flex-1 h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm ring-1 ring-white/30"
                  role="progressbar"
                  aria-valuenow={overallProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Overall progress: ${overallProgress} percent complete`}
                >
                  <div
                    className="h-full bg-linear-to-r from-white via-cream-50 to-white rounded-full transition-all duration-700 shadow-xl"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span
                  className="text-3xl md:text-4xl font-bold min-w-20 text-right tabular-nums"
                  aria-hidden="true"
                >
                  {overallProgress}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xl md:text-2xl text-white/95 mt-6 font-medium">
              Plant your first seed and watch your goals grow
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

      {totalGoals > 0 && (
        <section aria-label="Statistics overview">
          <h2 className="sr-only">Your Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md"
                  aria-hidden="true"
                >
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-bark-800 tabular-nums">
                  {totalGoals}
                </div>
              </div>
              <p
                className="text-sm font-medium text-bark-600"
                id="active-goals-label"
              >
                Active Goals
              </p>
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
              <p
                className="text-sm font-medium text-bark-600"
                id="steps-done-label"
              >
                Steps Done
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md"
                  aria-hidden="true"
                >
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-bark-800 tabular-nums">
                  {goalsWithProgress.length}
                </div>
              </div>
              <p
                className="text-sm font-medium text-bark-600"
                id="in-progress-label"
              >
                In Progress
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md"
                  aria-hidden="true"
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-bark-800 tabular-nums">
                  {overallProgress}%
                </div>
              </div>
              <p
                className="text-sm font-medium text-bark-600"
                id="overall-progress-label"
              >
                Overall Progress
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      {totalGoals > 0 && (
        <nav aria-label="Quick actions">
          <h2 className="sr-only">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Link
              href="/seasons"
              className="group relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              aria-label="Browse goals by season"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-bark-800">
                  Browse Seasons
                </h3>
              </div>
              <p className="text-sm text-bark-600">View goals by season</p>
            </Link>

            <Link
              href="/steps"
              className="group relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 rounded-2xl p-6 border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
              aria-label="View all steps across your goals"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-bark-800">All Steps</h3>
              </div>
              <p className="text-sm text-bark-600">Track all your tasks</p>
            </Link>

            <Link
              href="/archive"
              className="group relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-50 rounded-2xl p-6 border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300"
              aria-label="View archived and completed goals"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-bark-800">Archive</h3>
              </div>
              <p className="text-sm text-bark-600">Completed goals</p>
            </Link>
          </div>
        </nav>
      )}

      {/* Goals Section */}
      <section aria-label="Your goals">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-bark-800 tracking-tight">
              Your Goals
            </h2>
            <p className="text-bark-600 text-base mt-2 font-medium">
              {totalGoals === 0
                ? "Get started by creating your first goal"
                : `${activeGoals.length} active ${
                    activeGoals.length === 1 ? "goal" : "goals"
                  } this season`}
            </p>
          </div>
        </div>

        {activeGoals.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {activeGoals.map((goal, i) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-sage to-forest flex items-center justify-center"
                aria-hidden="true"
              >
                <Target className="w-10 h-10 text-white" />
              </div>
            }
            title="Plant your first seed"
            description="Every great journey begins with a single step. Create your first goal and start making progress today."
          />
        )}
      </section>

      {/* Create Goal Button */}
      <CreateGoalButton season={season} />
    </div>
  );
}
