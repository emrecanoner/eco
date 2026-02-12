"use client";

import { useEffect, useRef, useState } from "react";

interface InlineMetaProps {
  left?: string;
  right?: string | number;
}

export function InlineMeta({ left, right }: InlineMetaProps) {
  const [open, setOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!left) {
      setIsTruncated(false);
      setOpen(false);
      return;
    }

    const el = leftButtonRef.current;
    if (!el) return;

    const check = () => {
      setIsTruncated(el.scrollWidth > el.clientWidth + 1);
    };

    check();

    const ro = new ResizeObserver(() => check());
    ro.observe(el);
    return () => ro.disconnect();
  }, [left]);

  if (!left && !right) return null;

  const showTooltip = Boolean(left) && open && isTruncated;

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-[1fr_auto] items-start gap-x-2 text-[10px] text-zinc-300 sm:text-xs"
    >
      {left ? (
        <div className="min-w-0">
          <button
            ref={leftButtonRef}
            type="button"
            onClick={() => {
              if (!isTruncated) return;
              setOpen((v) => !v);
            }}
            className="block w-full text-left truncate focus:outline-none"
            aria-label={isTruncated ? "Show full text" : undefined}
            aria-expanded={showTooltip}
          >
            {left}
          </button>
          {showTooltip ? (
            <div
              className="absolute left-0 top-0 -translate-y-full -mt-2 max-w-[260px] rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-[10px] text-white shadow-xl sm:text-xs"
              role="tooltip"
            >
              {left}
            </div>
          ) : null}
        </div>
      ) : (
        <span />
      )}

      {right !== undefined && right !== null && right !== "" ? (
        <span className="shrink-0">{right}</span>
      ) : null}
    </div>
  );
}


