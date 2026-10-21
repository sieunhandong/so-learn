import Link from 'next/link'
import HeroPlayground from '@/components/landing/HeroPlayground'
import HighlightMarker from '@/components/landing/HighlightMarker'
import CurriculumExplorer from '@/components/landing/CurriculumExplorer'
import CtaCubes from '@/components/landing/CtaCubes'
import FlowSteps from '@/components/landing/FlowSteps'
import HowItWorks from '@/components/landing/HowItWorks'
import ParentFaq from '@/components/landing/ParentFaq'
import ProblemGallery from '@/components/landing/ProblemGallery'
import RewardsSection from '@/components/landing/RewardsSection'
import SectionHeading, { Accent } from '@/components/landing/SectionHeading'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import ButtonLink from '@/components/ui/ButtonLink'
import { PenTick } from '@/components/ui/Icons'
import TiltCard from '@/components/ui/TiltCard'
import { getTopics, grades, heroQuestion } from '@/lib/content'
import type { GradeLevel, Topic } from '@/types/math'

const promises = [
  'Không quảng cáo, không đường link dẫn ra ngoài.',
  'Đề nào cũng có hình minh họa và nút nghe đọc đề.',
  'Làm sai thì thử lại, không giới hạn số lần.',
  'Bố mẹ xem được bé học bao lâu, đúng bao nhiêu câu.',
]

// Khung và nhịp đệm chung cho mọi section dưới hero
const container = 'mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28'

export default function HomePage() {
  const topicsByGrade = Object.fromEntries(grades.map(g => [g.level, getTopics(g.level)])) as Record<GradeLevel, Topic[]>

  return (
    <>
      <SiteHeader>
        <ButtonLink href="/dashboard">Vào học</ButtonLink>
      </SiteHeader>

      {/* overflow-x-clip: cắt phần trang trí 3D lệch ra mép mà không tạo vùng cuộn mới */}
      <main className="overflow-x-clip">
        {/* Hero: tiêu đề bên trái, sân xếp khối 3D có thể làm thử bên phải */}
        <section className="relative overflow-hidden border-b-2 border-grid bg-oli">
          <div className="relative mx-auto grid max-w-6xl items-center gap-4 px-4 pb-14 pt-10 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-6 lg:py-10">
            <div>
              <h1 className="font-display text-[3.6rem] font-extrabold leading-[0.95] tracking-[-0.015em] text-ink-deep sm:text-[4.6rem] lg:text-[5.6rem]">
                Học toán
                <br />
                như <HighlightMarker>xếp khối</HighlightMarker>
              </h1>
              <p className="mt-6 max-w-[38ch] text-xl leading-relaxed text-graphite">
                Mỗi bài có hình để đếm và giọng đọc đề. Sai thì thử lại, đúng thì được đóng dấu đỏ. Từ lớp 1 đến lớp 5.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-5">
                <ButtonLink href="/dashboard" size="lg">
                  Bắt đầu học
                </ButtonLink>
                <nav aria-label="Mở thẳng một lớp" className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-display text-lg font-semibold text-pencil">Hoặc vào lớp</span>
                  <ul className="flex gap-1.5">
                    {grades.map(g => (
                      <li key={g.level}>
                        <Link
                          href={`/math/${g.level}`}
                          aria-label={`Lớp ${g.level}`}
                          className={`grid size-11 place-items-center rounded-lg font-display text-2xl font-extrabold shadow-[0_4px_0_0_rgb(42_22_115/0.3)] transition-[translate,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgb(42_22_115/0.3)] active:translate-y-0.5 active:shadow-none ${g.cover} ${g.coverText}`}
                        >
                          {g.level}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            <HeroPlayground question={heroQuestion} />
          </div>
        </section>

        <section className="bg-white">
          <div className={container}>
            <HowItWorks />
          </div>
        </section>

        <section className="bg-paper">
          <div className={container}>
            <ProblemGallery />
          </div>
        </section>

        <section id="chon-lop" className="scroll-mt-20 border-y-2 border-grid bg-[#F5F3FF]">
          <div className={container}>
            <SectionHeading
              layout="split"
              title={
                <>
                  Chương trình <Accent>5 lớp</Accent>, bài nào cũng vừa sức
                </>
              }
              lede="Chọn một lớp để xem mục lục. Bài sau mở khi bé đã bắt đầu bài trước."
            />
            <div className="mt-12">
              <CurriculumExplorer grades={grades} topicsByGrade={topicsByGrade} />
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className={container}>
            <SectionHeading
              layout="center"
              title={
                <>
                  Một buổi học,
                  <br />
                  <Accent>bốn bước quen thuộc</Accent>
                </>
              }
              lede="Từ lúc mở vở đến lúc nhận sao, bé luôn đi theo cùng một đường."
            />
            <div className="mt-12">
              <FlowSteps />
            </div>
          </div>
        </section>

        <section className="bg-paper">
          <div className={container}>
            <SectionHeading
              layout="split"
              title={
                <>
                  Sao, dấu đỏ và <Accent>nhãn dán</Accent>
                </>
              }
              lede="Phần thưởng tính theo cách bé làm bài, không tính theo tốc độ."
            />
            <div className="mt-14">
              <RewardsSection />
            </div>
          </div>
        </section>

        <section className="border-t-2 border-grid bg-white">
          <div className={`${container} grid items-start gap-14 lg:grid-cols-[1fr_1.2fr]`}>
            <div>
              <SectionHeading
                title={
                  <>
                    Dành cho
                    <br />
                    <Accent>bố mẹ</Accent>
                  </>
                }
                lede="Như cuốn sổ liên lạc ở trường, mọi điều bố mẹ cần biết đều ghi rõ ràng."
              />

              {/* Sổ liên lạc: giấy kẻ ngang, lề đỏ, gáy đóng ghim, đặt nghiêng trên bàn */}
              <TiltCard maxDeg={3} className="mt-10" innerClassName="rotate-x-[10deg] -rotate-2">
                <div className="relative rounded-lg bg-lined py-9 pl-16 pr-6 shadow-[0_36px_44px_-28px_rgb(42_22_115/0.6),0_0_0_2px_var(--color-grid)] before:absolute before:inset-y-0 before:left-11 before:w-0.5 before:bg-pen/40">
                  <span aria-hidden className="absolute left-4 top-6 h-4 w-1.5 rounded-full bg-pencil/40" />
                  <span aria-hidden className="absolute bottom-6 left-4 h-4 w-1.5 rounded-full bg-pencil/40" />
                  <p className="font-display text-2xl font-bold leading-9 text-ink">Sổ liên lạc</p>
                  <ul>
                    {promises.map(p => (
                      <li key={p} className="flex gap-3 text-lg leading-9 text-graphite">
                        <PenTick className="mt-1.5 size-6 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </div>

            <div>
              <h3 className="font-display text-2xl font-extrabold text-ink-deep">Bố mẹ hay hỏi</h3>
              <div className="mt-4">
                <ParentFaq />
              </div>
            </div>
          </div>
        </section>

        {/* Lời mời cuối trang, hai bên là cụm khối 3D như ở hero */}
        <section className="relative overflow-hidden border-t-2 border-grid bg-[linear-gradient(180deg,var(--color-paper),#ECE7FF)]">
          <CtaCubes
            towers={[
              { x: 0.2, cubes: ['ink', 'ink', 'ink'] },
              { x: 1.5, cubes: ['sun', 'sun'] },
            ]}
            className="absolute left-[5%] top-1/2 hidden -translate-y-1/2 xl:grid"
          />
          <CtaCubes
            towers={[
              { x: 0.2, cubes: ['leaf'] },
              { x: 1.5, cubes: ['pen', 'pen', 'ink', 'sun'] },
            ]}
            className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 xl:grid"
          />
          <div className={`${container} relative text-center`}>
            <SectionHeading
              layout="center"
              title={
                <>
                  Mở trang toán
                  <br />
                  <Accent>đầu tiên của bé</Accent>
                </>
              }
              lede="Chọn lớp rồi bắt đầu từ bài 1. Sai thì thử lại, không ai chấm điểm thời gian."
            />
            <div className="mt-9 flex flex-col items-center gap-6">
              <ButtonLink href="/dashboard" size="lg">
                Bắt đầu học
              </ButtonLink>
              <ul aria-label="Vào thẳng một lớp" className="flex flex-wrap justify-center gap-2">
                {grades.map(g => (
                  <li key={g.level}>
                    <Link
                      href={`/math/${g.level}`}
                      aria-label={`Lớp ${g.level}`}
                      className={`grid size-12 place-items-center rounded-xl font-display text-2xl font-extrabold shadow-[0_4px_0_0_rgb(42_22_115/0.3)] transition-[translate,box-shadow] duration-150 hover:-translate-y-1 active:translate-y-0.5 active:shadow-none ${g.cover} ${g.coverText}`}
                    >
                      {g.level}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
