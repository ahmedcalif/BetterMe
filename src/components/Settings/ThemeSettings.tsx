"use client";

import { updateTheme, type Theme } from "@/app/settings/actions";
import { useState } from "react";

interface ThemeSettingsProps {
  currentTheme: Theme;
}

const themes = [
  {
    value: "nature" as Theme,
    label: "Nature",
    description: "Warm earthy tones with sage and forest greens",
    preview: "bg-gradient-to-r from-sage-200 via-forest-300 to-bark-200",
  },
  {
    value: "light" as Theme,
    label: "Light",
    description: "Clean, bright, and crisp interface",
    preview: "bg-gradient-to-r from-green-50 via-emerald-100 to-green-50",
  },
  {
    value: "dark" as Theme,
    label: "Dark",
    description: "Subdued palette perfect for low-light environments",
    preview: "bg-gradient-to-r from-gray-800 via-green-950 to-gray-900",
  },
];

export default function ThemeSettings({ currentTheme }: ThemeSettingsProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleThemeChange = async (theme: Theme) => {
    setSelectedTheme(theme);
    setIsSaving(true);
    setMessage(null);

    const result = await updateTheme({ theme });

    if (result.success) {
      setMessage({ type: "success", text: result.message || "Theme updated" });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to update theme",
      });
      setSelectedTheme(currentTheme);
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-bark-800">
        Choose your preferred color scheme for the app
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.value}
            type="button"
            onClick={() => handleThemeChange(theme.value)}
            disabled={isSaving}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              selectedTheme === theme.value
                ? "border-forest bg-forest/5"
                : "border-sage/20 hover:border-sage/40"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className={`h-12 rounded-md mb-3 ${theme.preview}`} />

            <h3 className="font-semibold text-bark mb-1">{theme.label}</h3>
            <p className="text-sm text-bark-800">{theme.description}</p>

            {selectedTheme === theme.value && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-forest rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-cream"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <p className="text-xs text-bark-800 italic">
        Theme preferences are saved to your account and applied across all your
        devices.
      </p>
    </div>
  );
}
