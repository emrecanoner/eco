import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-4xl px-4 sm:px-5 lg:px-6 ${className}`}>
      {children}
    </div>
  );
}

