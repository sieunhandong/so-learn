export type ButtonVariant = 'ink' | 'paper' | 'sun'

export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-display font-bold transition-[transform,translate,box-shadow,background-color,border-color] duration-100 active:translate-y-1 active:shadow-none'

const sizes: Record<ButtonSize, string> = {
  md: 'px-6 py-3 text-lg',
  lg: 'px-8 py-4 text-xl hover:-translate-y-0.5',
}

// Nút "nổi" có cạnh dày bên dưới, bấm xuống thì lún vào
const variants: Record<ButtonVariant, string> = {
  ink: 'bg-ink text-white shadow-[0_5px_0_0_var(--color-ink-deep)] hover:bg-[#5A38CC]',
  paper: 'border-2 border-grid bg-white text-ink shadow-[0_5px_0_0_var(--color-grid)] hover:border-ink',
  sun: 'bg-sun text-ink-deep shadow-[0_5px_0_0_#D9A21F] hover:bg-[#FFD566]',
}

export function buttonClasses(variant: ButtonVariant = 'ink', extra = '', size: ButtonSize = 'md'): string {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`
}
