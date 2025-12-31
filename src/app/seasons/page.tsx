import { requireAuth } from "@/lib/auth";
import { parseSeasonKey } from "@/lib/utils";
import type { SeasonName } from "@/types";
import { Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserSeasons } from "./actions";

const seasonIcons: Record<SeasonName, typeof Snowflake> = {
  winter: Snowflake,
  spring: Flower2,
  summer: Sun,
  fall: Leaf,
};

const seasonColors: Record<SeasonName, string> = {
  winter: "text-blue-500 bg-blue-50 border-blue-200",
  spring: "text-pink-500 bg-pink-50 border-pink-200",
  summer: "text-amber-500 bg-amber-50 border-amber-200",
  fall: "text-orange-500 bg-orange-50 border-orange-200",
};

const seasonBackgrounds: Record<SeasonName, string> = {
  winter: "from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150",
  spring: "from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-150",
  summer: "from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-150",
  fall: "from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150",
};

export default async function SeasonsPage() {
  await requireAuth();

  const response = await getUserSeasons();

  if (!response.success) {
    redirect("/dashboard");
  }

  const seasonKeys = response.data || [];

  const seasons = seasonKeys
    .map((key) => {
      if (!key) return null;

      const parsed = parseSeasonKey(key);
      if (!parsed) return null;

      return {
        key,
        name: parsed.name,
        year: parsed.year,
        label: parsed.label,
      };
    })
    .filter((season): season is NonNullable<typeof season> => season !== null)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      const seasonOrder: Record<SeasonName, number> = {
        winter: 0,
        spring: 1,
        summer: 2,
        fall: 3,
      };
      return seasonOrder[b.name] - seasonOrder[a.name];
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bark mb-2">Seasons</h1>
        <p className="text-stone">Browse your goals organized by season</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seasons.map((season) => {
          const Icon = seasonIcons[season.name];

          return (
            <Link
              key={season.key}
              href={`/seasons/${season.key}`}
              className={`block bg-gradient-to-br ${
                seasonBackgrounds[season.name]
              } rounded-lg border-2 border-transparent p-6 transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-white/60 ${
                    seasonColors[season.name].split(" ")[0]
                  }`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-bark">
                    {season.label}
                  </h2>
                  <p className="text-sm text-stone">View goals</p>
                </div>
                <div className="ml-auto">
                  <svg
                    className="w-6 h-6 text-bark/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
