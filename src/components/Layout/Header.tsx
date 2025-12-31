import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Archive, Calendar, Leaf, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { NavLink } from "./NavLink";

export async function Header() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();
  const user = authenticated ? await getUser() : null;

  return (
    <header className="sticky top-0 z-50 bg-cream-100/80 backdrop-blur-lg border-b border-bark-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={authenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 rounded-lg"
          aria-label="BetterME - Go to home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sage-300 to-forest-400 flex items-center justify-center transition-transform group-hover:scale-105" aria-hidden="true">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-bark-800">BetterME</span>
        </Link>

        {/* Navigation */}
        {authenticated && (
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/seasons">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Seasons
            </NavLink>
            <NavLink href="/archive">
              <Archive className="w-4 h-4" aria-hidden="true" />
              Archive
            </NavLink>
            <NavLink href="/settings">
              <Settings className="w-4 h-4" aria-hidden="true" />
              Settings
            </NavLink>
          </nav>
        )}

        {/* User section */}
        <div className="flex items-center gap-2">
          {authenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2" role="status" aria-label={`Logged in as ${user.given_name ?? "User"}`}>
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={`${user.given_name ?? "User"} profile picture`}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center" aria-hidden="true">
                    <User className="w-4 h-4 text-sage-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-bark-700 hidden sm:block">
                  {user.given_name ?? "User"}
                </span>
              </div>
              <LogoutLink className="btn-ghost p-2 text-bark-500 hover:text-bark-700 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2 rounded-lg" aria-label="Sign out">
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </LogoutLink>
            </div>
          ) : (
            <LoginLink className="btn-primary focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2">Sign In</LoginLink>
          )}
        </div>
      </div>
    </header>
  );
}
