"use client";

import { useState, useEffect } from "react";

/**
 * Detects the number of grid columns based on Tailwind breakpoints.
 * grid-cols-2 (default) | lg:grid-cols-3 | xl:grid-cols-4
 */
export function useGridColumns() {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) setCols(4);
      else if (window.matchMedia("(min-width: 1024px)").matches) setCols(3);
      else setCols(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

/**
 * Returns the direction in which a detail panel should open.
 * Left-half columns open to the right, right-half columns open to the left.
 */
export function getCardDirection(index: number, cols: number): "left" | "right" {
  const col = index % cols;
  return col < cols / 2 ? "right" : "left";
}

