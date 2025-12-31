import { requireAuth } from "@/lib/auth";
import { getUserSettings } from "./actions";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/Settings/ProfileSettings";
import ThemeSettings from "@/components/Settings/ThemeSettings";
import AccountSettings from "@/components/Settings/AccountSettings";

export default async function SettingsPage() {
  const user = await requireAuth();

  const response = await getUserSettings();

  if (!response.success || !response.data) {
    redirect("/");
  }

  const settings = response.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bark mb-2">Settings</h1>
        <p className="text-stone">Manage your profile and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-sage/20 p-6">
          <h2 className="text-xl font-semibold text-bark mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </h2>
          <ProfileSettings
            email={settings.email}
            firstName={settings.firstName}
            lastName={settings.lastName}
            picture={settings.picture}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-sage/20 p-6">
          <h2 className="text-xl font-semibold text-bark mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            Display Preferences
          </h2>
          <ThemeSettings currentTheme={settings.theme} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Danger Zone
          </h2>
          <AccountSettings />
        </div>
      </div>
    </div>
  );
}
