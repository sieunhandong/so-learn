interface NotebookPageProps {
  children: React.ReactNode
  className?: string
}

/** Một trang vở ô li có lề đỏ bên trái */
export default function NotebookPage({ children, className = '' }: NotebookPageProps) {
  return (
    <div
      className={`relative rounded-2xl border-2 border-grid bg-oli py-6 pl-12 pr-5 shadow-sheet before:absolute before:inset-y-0 before:left-7 before:w-0.5 before:bg-pen/35 md:py-8 md:pl-16 md:pr-8 md:before:left-10 ${className}`}
    >
      {children}
    </div>
  )
}
