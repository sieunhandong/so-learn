import { StarIcon } from './Icons'

interface StarCountProps {
  value: number
}

export default function StarCount({ value }: StarCountProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-deep/15 bg-white px-3 py-1 font-display text-lg font-bold text-ink-deep">
      <StarIcon className="size-6" />
      {value}
      <span className="sr-only"> sao</span>
    </span>
  )
}
