import { Skeleton } from "@/components/ui/skeleton";

interface BarkCounterProps {
  count: number;
  isLoading?: boolean;
}

export function BarkCounter({ count, isLoading = false }: BarkCounterProps) {
  return (
    <div className="text-center px-4">
      {isLoading ? (
        <>
          <Skeleton className="h-12 sm:h-14 md:h-16 lg:h-20 w-24 mx-auto" />
          <Skeleton className="h-5 sm:h-6 w-16 mx-auto mt-2 sm:mt-3" />
        </>
      ) : (
        <>
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-chase-accent tabular-nums drop-shadow-glow">
            {count.toLocaleString()}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-chase-muted font-medium mt-2 sm:mt-3 uppercase tracking-widest">
            {count === 1 ? "bark" : "barks"}
          </p>
        </>
      )}
    </div>
  );
}
