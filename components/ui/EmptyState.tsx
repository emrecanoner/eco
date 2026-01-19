interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
  );
}

