import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Section({ children, title, className = "" }: SectionProps) {
  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      {title && (
        <h2 className="mb-6 text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

