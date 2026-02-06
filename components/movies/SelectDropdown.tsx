"use client";

interface SelectDropdownProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string | number; label: string }>;
  ariaLabel: string;
  className?: string;
}

export function SelectDropdown({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: SelectDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none rounded-lg border border-zinc-200 bg-white px-2.5 pr-8 py-1 text-xs font-semibold text-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:ring-zinc-100 sm:px-3 sm:pr-10 sm:py-1.5 sm:text-sm ${className}`}
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 sm:right-3">
        <svg
          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

