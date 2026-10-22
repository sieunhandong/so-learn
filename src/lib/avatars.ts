/** Màu hồ sơ của bé. `id` được lưu ở cột students.avatar. */
export const AVATARS = [
  { id: 'sun', label: 'Vàng', className: 'bg-sun text-ink-deep' },
  { id: 'leaf', label: 'Xanh lá', className: 'bg-leaf text-white' },
  { id: 'sky', label: 'Xanh trời', className: 'bg-sky text-white' },
  { id: 'ink', label: 'Tím', className: 'bg-ink text-white' },
  { id: 'pen', label: 'Đỏ', className: 'bg-pen text-white' },
] as const

export type AvatarId = (typeof AVATARS)[number]['id']

export function isAvatarId(value: string): value is AvatarId {
  return AVATARS.some(a => a.id === value)
}

export function avatarClass(id: string): string {
  return AVATARS.find(a => a.id === id)?.className ?? AVATARS[0].className
}
