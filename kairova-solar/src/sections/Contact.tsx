import { useState, type FormEvent, type ReactNode } from 'react'
import { Loader2, ArrowRight, Phone, MessageCircle, Mail } from 'lucide-react'
import { brand } from '../data/brand'
import { services } from '../data/services'
import { submitContact, type ContactPayload } from '../utils/submitContact'

type Errors = Partial<Record<keyof ContactPayload, string>>
type Status = 'idle' | 'sending' | 'success'

const initial: ContactPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  area: '',
  propertyType: '',
  monthlyBill: '',
  service: '',
  message: '',
  consent: false
}

function validate(v: ContactPayload): Errors {
  const e: Errors = {}
  if (!v.firstName.trim()) e.firstName = 'Please enter your first name.'
  if (!v.lastName.trim()) e.lastName = 'Please enter your last name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'That email address does not look right.'
  if (!v.phone.trim()) e.phone = 'Please enter a phone number.'
  else if (!/^[+\d][\d\s()-]{6,}$/.test(v.phone.trim())) e.phone = 'That phone number does not look right.'
  if (!v.area) e.area = 'Please choose your area.'
  if (!v.propertyType) e.propertyType = 'Please choose a property type.'
  if (!v.service) e.service = 'Please choose a service.'
  if (!v.consent) e.consent = 'Please confirm we may contact you about this enquiry.'
  return e
}

export default function Contact() {
  const [values, setValues] = useState<ContactPayload>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      const first = document.querySelector('[data-error="true"]') as HTMLElement | null
      first?.querySelector<HTMLElement>('input, select, textarea')?.focus()
      return
    }
    setStatus('sending')
    await submitContact(values) // Demo only: no email is sent, nothing is stored.
    setStatus('success')
  }

  const inputCls = (hasError?: string) =>
    `w-full rounded-sm border bg-ink/40 px-4 py-3 text-[15px] text-ivory placeholder:text-mist/60 transition-colors focus:border-amber focus:outline-none ${
      hasError ? 'border-red-400/70' : 'border-ivory/20'
    }`

  return (
    <section id="contact" className="bg-graphite">
      <div className="container-k grid gap-14 py-24 md:py-32 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="tag-k">Contact</p>
          <h2 className="display-lg mt-4 text-ivory">
            Let&rsquo;s design the right system{' '}
            <span className="text-amber">for your property.</span>
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-mist">
            Tell us a little about your property and usage. We reply within one working day with
            the next step.
          </p>
          <ul className="mt-10 space-y-4 text-[15px] text-ivory/85">
            <li>
              <a href={brand.contact.phoneHref} className="flex items-center gap-3 hover:text-amber">
                <Phone size={17} className="text-amber" /> {brand.contact.phone}
              </a>
            </li>
            <li>
              <a href={brand.contact.whatsappHref} className="flex items-center gap-3 hover:text-amber">
                <MessageCircle size={17} className="text-amber" /> {brand.contact.whatsapp} (WhatsApp)
              </a>
            </li>
            <li>
              <a href={brand.contact.emailHref} className="flex items-center gap-3 hover:text-amber">
                <Mail size={17} className="text-amber" /> {brand.contact.email}
              </a>
            </li>
          </ul>
          <p className="mt-10 text-[12px] leading-relaxed text-mist/60">
            Demo form. Nothing is sent or stored. See src/utils/submitContact.ts to connect a real
            webhook.
          </p>
        </div>

        {status === 'success' ? (
          <SuccessState onReset={() => { setValues(initial); setStatus('idle') }} firstName={values.firstName} />
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
            <FieldWrap label="First name" error={errors.firstName}>
              <input className={inputCls(errors.firstName)} value={values.firstName} autoComplete="given-name"
                onChange={(e) => set('firstName', e.target.value)} placeholder="Thandi" />
            </FieldWrap>
            <FieldWrap label="Last name" error={errors.lastName}>
              <input className={inputCls(errors.lastName)} value={values.lastName} autoComplete="family-name"
                onChange={(e) => set('lastName', e.target.value)} placeholder="Nel" />
            </FieldWrap>
            <FieldWrap label="Email" error={errors.email}>
              <input type="email" className={inputCls(errors.email)} value={values.email} autoComplete="email"
                onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
            </FieldWrap>
            <FieldWrap label="Phone" error={errors.phone}>
              <input type="tel" className={inputCls(errors.phone)} value={values.phone} autoComplete="tel"
                onChange={(e) => set('phone', e.target.value)} placeholder="+27 82 000 0000" />
            </FieldWrap>
            <FieldWrap label="Area" error={errors.area}>
              <select className={inputCls(errors.area)} value={values.area} onChange={(e) => set('area', e.target.value)}>
                <option value="">Choose an area</option>
                {brand.serviceAreas.map((a) => <option key={a}>{a}</option>)}
                <option>Other</option>
              </select>
            </FieldWrap>
            <FieldWrap label="Property type" error={errors.propertyType}>
              <select className={inputCls(errors.propertyType)} value={values.propertyType}
                onChange={(e) => set('propertyType', e.target.value)}>
                <option value="">Choose a type</option>
                <option>House</option>
                <option>Townhouse or complex</option>
                <option>Small business</option>
                <option>Office or retail</option>
                <option>Warehouse or industrial</option>
              </select>
            </FieldWrap>
            <FieldWrap label="Average electricity bill (optional)">
              <select className={inputCls()} value={values.monthlyBill} onChange={(e) => set('monthlyBill', e.target.value)}>
                <option value="">Prefer not to say</option>
                <option>Under R1 500</option>
                <option>R1 500 to R3 000</option>
                <option>R3 000 to R6 000</option>
                <option>R6 000 to R15 000</option>
                <option>Over R15 000</option>
              </select>
            </FieldWrap>
            <FieldWrap label="Interested service" error={errors.service}>
              <select className={inputCls(errors.service)} value={values.service} onChange={(e) => set('service', e.target.value)}>
                <option value="">Choose a service</option>
                {services.map((s) => <option key={s.id}>{s.title}</option>)}
                <option>Not sure yet</option>
              </select>
            </FieldWrap>
            <FieldWrap label="Message (optional)" full>
              <textarea rows={4} className={inputCls()} value={values.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Anything useful: roof type, current interruptions setup, timelines." />
            </FieldWrap>

            <div className="sm:col-span-2" data-error={errors.consent ? 'true' : undefined}>
              <label className="flex items-start gap-3 text-[14px] text-ivory/80">
                <input type="checkbox" checked={values.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-amber" />
                I agree that Kairova Solar may contact me about this enquiry. (Demo site: nothing
                is actually sent or stored.)
              </label>
              {errors.consent && <ErrorText text={errors.consent} />}
            </div>

            <div className="sm:col-span-2">
              <button type="submit" disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-7 py-4 text-[15px] font-semibold text-ink transition-colors hover:bg-[#ffd763] disabled:opacity-70 sm:w-auto">
                {status === 'sending' ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Sending request
                  </>
                ) : (
                  <>
                    Request My Assessment <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

function FieldWrap({ label, error, full, children }: {
  label: string; error?: string; full?: boolean; children: ReactNode
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''} data-error={error ? 'true' : undefined}>
      <label className="block">
        <span className="mb-2 block text-[13px] font-medium text-ivory/70">{label}</span>
        {children}
      </label>
      {error && <ErrorText text={error} />}
    </div>
  )
}

function ErrorText({ text }: { text: string }) {
  return (
    <p className="mt-1.5 text-[13px] text-red-300" role="alert">
      {text}
    </p>
  )
}

function SuccessState({ onReset, firstName }: { onReset: () => void; firstName: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-ivory/12 bg-ink px-8 py-16 text-center">
      <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden="true">
        <circle cx="48" cy="48" r="42" fill="none" stroke="#C9F75A" strokeWidth="3"
          strokeDasharray="264" strokeDashoffset="264"
          style={{ animation: 'k-draw 0.9s ease-out forwards' }} />
        <path d="M32 50 L44 62 L66 38" fill="none" stroke="#C9F75A" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="60" strokeDashoffset="60"
          style={{ animation: 'k-draw 0.5s ease-out 0.7s forwards' }} />
        <style>{'@keyframes k-draw { to { stroke-dashoffset: 0; } }'}</style>
      </svg>
      <h3 className="display-md mt-6 text-ivory">
        Thanks{firstName ? `, ${firstName.trim()}` : ''}. Request received.
      </h3>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mist">
        In the real version, our team would reply within one working day to book your assessment.
        This demo does not send or store anything.
      </p>
      <button onClick={onReset}
        className="mt-8 rounded-sm border border-ivory/25 px-6 py-3 text-[14px] font-medium text-ivory transition-colors hover:border-amber hover:text-amber">
        Send another enquiry
      </button>
    </div>
  )
}
