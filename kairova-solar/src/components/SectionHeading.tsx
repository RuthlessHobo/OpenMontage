import type { ReactNode } from 'react'

interface Props {
  tag: string
  title: ReactNode
  copy?: string
  align?: 'left' | 'center'
  dark?: boolean
  size?: 'lg' | 'xl'
}

export default function SectionHeading({
  tag,
  title,
  copy,
  align = 'left',
  dark = true,
  size = 'lg'
}: Props) {
  return (
    <div className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl`}>
      <p className="tag-k">{tag}</p>
      <h2
        className={`${size === 'xl' ? 'display-xl' : 'display-lg'} mt-4 ${dark ? 'text-ivory' : 'text-ink'}`}
        style={{ textWrap: 'pretty' as never }}
      >
        {title}
      </h2>
      {copy && (
        <p className={`mt-5 text-[17px] leading-relaxed ${dark ? 'text-mist' : 'text-ink/70'}`}>
          {copy}
        </p>
      )}
    </div>
  )
}
