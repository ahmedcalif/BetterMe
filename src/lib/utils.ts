import type { Season, SeasonName, Step } from "@/types";

/**
 * Get the season name from a month number (0-11)
 */
export function getSeasonFromMonth(month: number): SeasonName {
  if (month >= 0 && month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "fall";
}

/**
 * Get the current season based on today's date
 */
export function getCurrentSeason(): Season {
  const now = new Date();
  const name = getSeasonFromMonth(now.getMonth());
  const year = now.getFullYear();
  return { name, year, label: formatSeasonLabel(name, year) };
}

/**
 * Format a season key for database storage (e.g., "winter_2025")
 */
export function formatSeasonKey(name: SeasonName, year: number): string {
  return `${name}_${year}`;
}

/**
 * Format a season label for display (e.g., "Winter 2025")
 */
export function formatSeasonLabel(name: SeasonName, year: number): string {
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${year}`;
}

/**
 * Parse a season key back into a Season object
 */
export function parseSeasonKey(key: string): Season | null {
  const match = key.match(/^(winter|spring|summer|fall)_(\d{4})$/);
  if (!match) return null;
  const name = match[1] as SeasonName;
  const year = parseInt(match[2], 10);
  return { name, year, label: formatSeasonLabel(name, year) };
}

/**
 * Get the previous season
 */
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

/**
 * Get the next season
 */
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

/**
 * Calculate progress percentage from steps
 */
export function calculateProgress(steps: Step[]): number {
  if (steps.length === 0) return 0;
  const completed = steps.filter((s) => s.isCompleted).length;
  return Math.round((completed / steps.length) * 100);
}

/**
 * Get a friendly progress message based on percentage
 */
export function getProgressMessage(progress: number): string {
  if (progress === 0) return "Ready to begin";
  if (progress < 25) return "Just getting started";
  if (progress < 50) return "Making progress";
  if (progress < 75) return "More than halfway";
  if (progress < 100) return "Almost there";
  return "Complete!";
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
