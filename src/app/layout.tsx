import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Layout/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getDB } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetterMe",
  description:
    "Track your goals peacefully. BetterMe keeps things simple so you can focus on what truly matters.",
};

async function getUserTheme(): Promise<"light" | "dark" | "nature"> {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
      return "nature"; // Default theme for unauthenticated users
    }

    const db = getDB();
    const userRecord = await db
      .select({ theme: users.theme })
      .from(users)
      .where(eq(users.kindeId, kindeUser.id))
      .limit(1);

    if (userRecord.length > 0 && userRecord[0].theme) {
      return userRecord[0].theme as "light" | "dark" | "nature";
    }

    return "nature"; // Default fallback
  } catch {
    return "nature"; // Default on error
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getUserTheme();

  return (
    <html lang="en" className="h-full" data-theme={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}
      >
        <ThemeProvider theme={theme} />
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
