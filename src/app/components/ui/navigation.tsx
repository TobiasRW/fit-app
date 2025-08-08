"use client";

import Link from "next/link";
import {
  HouseSimpleIcon,
  ChartPieSliceIcon,
  BarbellIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between bg-white px-6 py-4 dark:bg-black">
      <Link
        href="/"
        className={`flex flex-col items-center ${
          pathname === "/" ? "text-green" : "text-foreground"
        }`}
      >
        <HouseSimpleIcon size={32} weight="light" />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/stats"
        className={`flex flex-col items-center ${
          pathname === "/stats" ? "text-green" : "text-foreground"
        }`}
      >
        <ChartPieSliceIcon size={32} weight="light" />
        <span className="text-xs">Stats</span>
      </Link>
      <Link
        href="/workouts"
        className={`flex flex-col items-center ${
          pathname === "/workouts" ? "text-green" : "text-foreground"
        }`}
      >
        <BarbellIcon size={32} weight="light" />
        <span className="text-xs">Workouts</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center ${
          pathname === "/profile" ? "text-green" : "text-foreground"
        }`}
      >
        <UserIcon size={32} weight="light" />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
}
