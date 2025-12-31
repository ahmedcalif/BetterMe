import type { Season, SeasonName } from "@/types";
import { Flower2, Leaf, Snowflake, Sun } from "lucide-react";

const seasonIcons: Record<SeasonName, typeof Snowflake> = {
  winter: Snowflake,
  spring: Flower2,
  summer: Sun,
  fall: Leaf,
};

const seasonColors: Record<SeasonName, string> = {
  winter: "text-blue-500",
  spring: "text-pink-500",
  summer: "text-amber-500",
  fall: "text-orange-500",
};

const seasonBackgrounds: Record<SeasonName, string> = {
  winter: "from-blue-50 to-blue-100",
  spring: "from-pink-50 to-pink-100",
  summer: "from-amber-50 to-amber-100",
  fall: "from-orange-50 to-orange-100",
};

interface SeasonHeaderProps {
  season: Season;
  goalCount: number;
}

export function SeasonHeader({ season, goalCount }: SeasonHeaderProps) {
  const Icon = seasonIcons[season.name];

  return (
    <div
      className={`card bg-gradient-to-br ${
        seasonBackgrounds[season.name]
      } border-0`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-xl bg-white/60 ${seasonColors[season.name]}`}
        >
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-bark-800">{season.label}</h1>
          <p className="text-bark-500">
            {goalCount === 0
              ? "Start by planting your first goal"
              : goalCount === 1
              ? "1 goal this season"
              : `${goalCount} goals this season`}
          </p>
        </div>
      </div>
    </div>
  );
}
