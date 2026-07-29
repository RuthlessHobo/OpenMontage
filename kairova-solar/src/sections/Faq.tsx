import { useState } from 'react'
import { Plus } from 'lucide-react'
import { faq } from '../data/faq'
import SectionHeading from '../components/SectionHeading'

// Accessible accordion: buttons with aria-expanded, panels with role=region.
export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-ivory text-ink">
      <div className="container-k grid gap-12 pb-24 pt-4 md:pb-32 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading
          tag="Questions"
          dark={false}
          title={
            <>
              Asked before <span className="text-[#B07E10]">every install.</span>
            </>
          }
          copy="Straight answers to the questions most people start with."
        />

        <div className="divide-y divide-ink/12 border-y border-ink/12">
          {faq.map((item, i) => {
            const open = openIndex === i
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={`faq-btn-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[17px] font-semibold transition-colors hover:text-[#B07E10]"
                  >
                    {item.q}
                    <Plus
                      size={18}
                      className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pb-6 text-[15px] leading-relaxed text-ink/70">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
