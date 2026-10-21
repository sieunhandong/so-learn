import { buttonClasses, type ButtonVariant } from './buttonStyles'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: ButtonVariant
  className?: string
  autoFocus?: boolean
}

export default function Button({ children, onClick, variant = 'ink', className = '', autoFocus }: ButtonProps) {
  return (
    <button type="button" onClick={onClick} autoFocus={autoFocus} className={buttonClasses(variant, className)}>
      {children}
    </button>
  )
}
