"use client";

import { Loading } from "@/components/ui/Loading";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {loading && <Loading />}
      </AnimatePresence>
      {children}
    </>
  );
}

