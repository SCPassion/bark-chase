interface BarkCounterProps {
  count: number
}

export function BarkCounter({ count }: BarkCounterProps) {
  return (
    <div className="text-center">
      <p className="text-5xl md:text-7xl font-bold text-chase-accent tabular-nums drop-shadow-glow">
        {count.toLocaleString()}
      </p>
      <p className="text-lg text-chase-muted font-medium mt-1 uppercase tracking-widest">
        {count === 1 ? "bark" : "barks"}
      </p>
    </div>
  )
}
