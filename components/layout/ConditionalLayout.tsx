"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/landing/Navigation";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {!isHomePage && <Navigation />}
      <main className={isHomePage ? "" : "pt-12 sm:pt-14"}>{children}</main>
    </>
  );
}

