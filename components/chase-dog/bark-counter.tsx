interface BarkCounterProps {
  count: number
  isLoading?: boolean
}

export function BarkCounter({ count, isLoading = false }: BarkCounterProps) {
  return (
    <div className="text-center px-4">
      <p
        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-chase-accent tabular-nums drop-shadow-glow transition-[filter] duration-200 ${isLoading ? "select-none blur-md" : ""}`}
      >
        {count.toLocaleString()}
      </p>
      <p className="text-base sm:text-lg md:text-xl text-chase-muted font-medium mt-2 sm:mt-3 uppercase tracking-widest">
        {count === 1 ? "bark" : "barks"}
      </p>
    </div>
  )
}
