"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/history", label: "Trends" },
  { href: "/admin", label: "Alert settings" },
];

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getCookieValue("uniabuja-session"));
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsername(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-campus-700 dark:bg-slate-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-wide text-campus-100 dark:text-slate-400">
              University of Abuja
            </p>
            <h1 className="text-base sm:text-lg font-semibold leading-snug">
              Smart Weather Monitoring &amp; Environmental Alert System
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {username && (
              <div className="hidden sm:flex items-center rounded-full bg-campus-600/70 px-2.5 py-1 text-xs font-medium text-campus-50 dark:bg-slate-700 dark:text-slate-200">
                {username}
              </div>
            )}
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-campus-100 dark:text-slate-300 hover:bg-campus-600 dark:hover:bg-slate-700"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto -mx-1 px-1 no-scrollbar">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap shrink-0 ${
                pathname === link.href
                  ? "bg-white text-campus-700 dark:bg-slate-100 dark:text-slate-800"
                  : "text-campus-100 dark:text-slate-300 hover:bg-campus-600 dark:hover:bg-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
