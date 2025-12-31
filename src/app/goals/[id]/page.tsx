import { getGoalById } from "@/app/goals/actions";
import { GoalDetailContent } from "@/components/Goals/GoalDetailContent";
import { requireAuth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface GoalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GoalPage({ params }: GoalPageProps) {
  await requireAuth();

  const { id } = await params;

  const response = await getGoalById(id);

  if (!response.success || !response.data) {
    redirect("/dashboard");
  }

  const goal = response.data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 animate-fade-in">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-bark-600 hover:text-forest-600 transition-colors font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <GoalDetailContent goal={goal} />
    </div>
  );
}
