'use client'

import { useActionState } from 'react'
import { addStudent, type StudentFormState } from '@/app/parent/actions'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { AVATARS } from '@/lib/avatars'

/** Form tạo hồ sơ cho bé: tên, lớp, màu hồ sơ */
export default function StudentForm() {
  const [state, formAction, pending] = useActionState<StudentFormState, FormData>(addStudent, {})

  return (
    // key đổi sau mỗi lần lưu thành công để form tự xóa ô nhập
    <form key={state.savedCount ?? 0} action={formAction} className="space-y-5">
      <label className="block">
        <span className="font-display text-lg font-bold text-ink-deep">Tên của bé</span>
        <input
          name="name"
          required
          maxLength={40}
          placeholder="Ví dụ: Bin"
          className="mt-1 w-full rounded-xl border-2 border-grid bg-white px-4 py-3 text-lg text-ink-deep outline-none focus:border-ink"
        />
      </label>

      <label className="block">
        <span className="font-display text-lg font-bold text-ink-deep">Bé học lớp</span>
        <select name="grade" defaultValue="1" className="mt-1 w-full rounded-xl border-2 border-grid bg-white px-4 py-3 text-lg text-ink-deep outline-none focus:border-ink">
          {[1, 2, 3, 4, 5].map(g => (
            <option key={g} value={g}>
              Lớp {g}
              {g === 1 ? '' : ' (đang soạn bài)'}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="font-display text-lg font-bold text-ink-deep">Màu hồ sơ</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVATARS.map((a, i) => (
            <label key={a.id} className="cursor-pointer">
              <input type="radio" name="avatar" value={a.id} defaultChecked={i === 0} className="peer sr-only" />
              <span
                className={`grid size-12 place-items-center rounded-full font-display text-sm font-bold ring-offset-2 transition-shadow peer-checked:ring-4 peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-sun ${a.className}`}
              >
                <span className="sr-only">{a.label}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite">
        {state.error && <p className="rounded-xl border-2 border-pen/30 bg-[#FFF1F0] px-4 py-3 text-base text-pen">{state.error}</p>}
      </div>

      <button type="submit" disabled={pending} className={buttonClasses('ink', 'w-full disabled:opacity-60')}>
        {pending ? 'Đang lưu…' : 'Tạo hồ sơ'}
      </button>
    </form>
  )
}
