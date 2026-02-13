"use client";

import { useEffect, useRef, useState } from "react";

interface RevealTruncatedTextProps {
  text?: string | null;
  tooltipMaxWidthClassName?: string;
}

export function RevealTruncatedText({
  text,
  tooltipMaxWidthClassName = "max-w-[260px]",
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
    const truncated = el.scrollWidth > el.clientWidth + 1;
    if (!truncated) return;
    setOpen((v) => !v);
  };

  return (
    <div ref={containerRef} className="relative min-w-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="block w-full truncate text-left focus:outline-none"
        aria-label="Show full text"
        aria-expanded={open}
      >
        {text}
      </button>
      {open ? (
        <div
          className={`absolute left-0 top-full mt-1 z-50 ${tooltipMaxWidthClassName} rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs font-normal text-white shadow-xl`}
          role="tooltip"
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}


