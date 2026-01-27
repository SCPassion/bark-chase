interface BarkCounterProps {
  count: number
}

export function BarkCounter({ count }: BarkCounterProps) {
  return (
    <div className="text-center px-4">
      <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-chase-accent tabular-nums drop-shadow-glow">
        {count.toLocaleString()}
      </p>
      <p className="text-base sm:text-lg md:text-xl text-chase-muted font-medium mt-2 sm:mt-3 uppercase tracking-widest">
        {count === 1 ? "bark" : "barks"}
      </p>
    </div>
  )
}
