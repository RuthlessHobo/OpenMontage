import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react'
import { brand } from '../data/brand'

export default function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-[#070909]">
      <div className="container-k grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src="/brand/kairova-logo-full.svg" alt="Kairova Solar" className="h-10 w-auto" />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-mist">
            {brand.description}
          </p>
          <p className="mt-6 text-[13px] leading-relaxed text-mist/70">
            {brand.demoDisclosure}
          </p>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory/60">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-[14px] text-mist">
            <li>
              <a href={brand.contact.phoneHref} className="flex items-start gap-2.5 hover:text-amber">
                <Phone size={15} className="mt-0.5 shrink-0" /> {brand.contact.phone}
              </a>
            </li>
            <li>
              <a href={brand.contact.whatsappHref} className="flex items-start gap-2.5 hover:text-amber">
                <MessageCircle size={15} className="mt-0.5 shrink-0" /> {brand.contact.whatsapp}
              </a>
            </li>
            <li>
              <a href={brand.contact.emailHref} className="flex items-start gap-2.5 hover:text-amber">
                <Mail size={15} className="mt-0.5 shrink-0" /> {brand.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0" /> {brand.contact.address}
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={15} className="mt-0.5 shrink-0" />
              <span>
                {brand.contact.hours[0]}
                <br />
                {brand.contact.hours[1]}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory/60">
            Service areas
          </h3>
          <ul className="mt-5 space-y-2.5 text-[14px] text-mist">
            {brand.serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory/60">
            Navigate
          </h3>
          <ul className="mt-5 space-y-2.5 text-[14px]">
            {brand.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-mist hover:text-amber">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#estimate" className="text-mist hover:text-amber">
                Solar Estimate
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-k flex flex-col gap-2 py-6 text-[12px] text-mist/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Kairova Solar. A fictional demonstration brand.</p>
          <p>Demo website. No real services are offered.</p>
        </div>
      </div>
    </footer>
  )
}
