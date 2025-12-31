import type { Season, SeasonName, Step } from "@/types";

export function getSeasonFromMonth(month: number): SeasonName {
  if (month >= 0 && month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "fall";
}

export function getCurrentSeason(): Season {
  const now = new Date();
  const name = getSeasonFromMonth(now.getMonth());
  const year = now.getFullYear();
  return { name, year, label: formatSeasonLabel(name, year) };
}

export function formatSeasonKey(name: SeasonName, year: number): string {
  return `${name}_${year}`;
}

export function formatSeasonLabel(name: SeasonName, year: number): string {
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${year}`;
}

export function parseSeasonKey(key: string): Season | null {
  const match = key.match(/^(winter|spring|summer|fall)_(\d{4})$/);
  if (!match) return null;
  const name = match[1] as SeasonName;
  const year = parseInt(match[2], 10);
  return { name, year, label: formatSeasonLabel(name, year) };
}

export function getPreviousSeason(current: Season): Season {
  const seasons: SeasonName[] = ["winter", "spring", "summer", "fall"];
  const idx = seasons.indexOf(current.name);
  if (idx === 0) {
    return {
      name: "fall",
      year: current.year - 1,
      label: formatSeasonLabel("fall", current.year - 1),
    };
  }
  return {
    name: seasons[idx - 1],
    year: current.year,
    label: formatSeasonLabel(seasons[idx - 1], current.year),
  };
}

export function getNextSeason(current: Season): Season {
  const seasons: SeasonName[] = ["winter", "spring", "summer", "fall"];
  const idx = seasons.indexOf(current.name);
  if (idx === 3) {
    return {
      name: "winter",
      year: current.year + 1,
      label: formatSeasonLabel("winter", current.year + 1),
    };
  }
  return {
    name: seasons[idx + 1],
    year: current.year,
    label: formatSeasonLabel(seasons[idx + 1], current.year),
  };
}

export function calculateProgress(steps: Step[]): number {
  if (steps.length === 0) return 0;
  const completed = steps.filter((s) => s.isCompleted).length;
  return Math.round((completed / steps.length) * 100);
}

export function getProgressMessage(progress: number): string {
  if (progress === 0) return "Ready to begin";
  if (progress < 25) return "Just getting started";
  if (progress < 50) return "Making progress";
  if (progress < 75) return "More than halfway";
  if (progress < 100) return "Almost there";
  return "Complete!";
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
