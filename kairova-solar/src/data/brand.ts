// Central brand configuration.
// NOTE: Kairova Solar is a FICTIONAL demonstration brand. All details below are
// invented for this demo and must not be treated as a real business.

export const brand = {
  name: 'Kairova Solar',
  wordmark: 'KAIROVA',
  descriptor: 'SOLAR + STORAGE',
  tagline: 'Power built around your life.',
  description:
    'Kairova Solar designs residential and commercial solar, battery storage and backup power systems around how each property actually uses electricity.',
  demoDisclosure:
    'This website and company are fictional and were created for design demonstration purposes.',
  contact: {
    phone: '+27 21 555 0147',
    phoneHref: 'tel:+27215550147',
    whatsapp: '+27 72 555 0189',
    whatsappHref: 'https://wa.me/27725550189',
    email: 'hello@kairovasolar.example',
    emailHref: 'mailto:hello@kairovasolar.example',
    address: '18 Aurora Park, Century City, Cape Town, 7441',
    hours: ['Monday to Friday, 08:00 to 17:30', 'Saturday, 09:00 to 13:00']
  },
  serviceAreas: [
    'Cape Town',
    'Durbanville',
    'Stellenbosch',
    'Paarl',
    'Somerset West',
    'Blouberg',
    'Southern Suburbs'
  ],
  nav: [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Why Solar', href: '#why-solar' },
    { label: 'Projects', href: '#projects' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ],
  // Fictional demo labels. These do not reference real certification bodies or suppliers.
  trust: {
    capabilities: [
      'Residential solar',
      'Commercial solar',
      'Battery storage',
      'System upgrades',
      'Monitoring',
      'Ongoing support'
    ],
    demoLabels: [
      'Demo Certification A',
      'Demo Installer Registration',
      'Demo Equipment Partner 1',
      'Demo Equipment Partner 2'
    ]
  }
} as const
