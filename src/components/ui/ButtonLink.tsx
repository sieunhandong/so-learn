import Link from 'next/link'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

interface ButtonLinkProps {
  href: string
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export default function ButtonLink({ href, children, variant = 'ink', size = 'md', className = '' }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, className, size)}>
      {children}
    </Link>
  )
}
