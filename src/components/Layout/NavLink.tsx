"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2",
        isActive
          ? "bg-forest-100 text-forest-700"
          : "text-bark-500 hover:text-bark-700 hover:bg-cream-200"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
