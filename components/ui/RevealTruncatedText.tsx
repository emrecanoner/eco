"use client";

import { useEffect, useRef, useState } from "react";

interface RevealTruncatedTextProps {
  text?: string | null;
  lines?: 1 | 2;
  tooltipMaxWidthClassName?: string;
  direction?: "above" | "below";
}

export function RevealTruncatedText({
  text,
  lines = 1,
  tooltipMaxWidthClassName = "max-w-[260px]",
  direction = "below",
}: RevealTruncatedTextProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (!text) return null;

  const onToggle = () => {
    const el = buttonRef.current;
    if (!el) return;
    const truncated =
      el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
    if (!truncated) return;
    setOpen((v) => !v);
  };

  return (
    <div ref={containerRef} className="relative min-w-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className={`block w-full text-left focus:outline-none ${
          lines === 1 ? "truncate" : "overflow-hidden"
        }`}
        style={
          lines === 2
            ? {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }
            : undefined
        }
        aria-label="Show full text"
        aria-expanded={open}
      >
        {text}
      </button>
      {open ? (
        <div
          className={`absolute left-0 z-50 ${
            direction === "above" ? "bottom-full mb-1" : "top-full mt-1"
          } ${tooltipMaxWidthClassName} rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs font-normal text-white shadow-xl`}
          role="tooltip"
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}


