export type ServiceId =
  | 'residential'
  | 'battery'
  | 'commercial'
  | 'upgrades'
  | 'monitoring'

export interface Service {
  id: ServiceId
  index: string
  title: string
  copy: string
  features: string[]
  cta: string
}

export const services: Service[] = [
  {
    id: 'residential',
    index: '01',
    title: 'Residential Solar',
    copy: 'Solar systems designed around household consumption, roof structure and future energy needs.',
    features: [
      'Consumption-led panel sizing',
      'Roof structure and orientation review',
      'Hybrid inverter options',
      'Designed to expand later'
    ],
    cta: 'Plan a home system'
  },
  {
    id: 'battery',
    index: '02',
    title: 'Battery Backup',
    copy: 'Store solar production and maintain selected circuits when grid power is unavailable.',
    features: [
      'Essential-circuit planning',
      'Evening and interruption cover',
      'Expandable capacity',
      'Automatic switchover'
    ],
    cta: 'Size a battery'
  },
  {
    id: 'commercial',
    index: '03',
    title: 'Commercial Solar',
    copy: 'Scalable systems for offices, retail spaces, warehouses and commercial properties.',
    features: [
      'Daytime load offsetting',
      'Phased rollout options',
      'Three-phase system design',
      'Reporting for operations teams'
    ],
    cta: 'Discuss a commercial site'
  },
  {
    id: 'upgrades',
    index: '04',
    title: 'System Upgrades',
    copy: 'Add panels, replace an inverter, increase battery capacity or improve an existing system.',
    features: [
      'Existing-system assessment',
      'Panel and inverter additions',
      'Battery capacity increases',
      'Wiring and safety improvements'
    ],
    cta: 'Review my system'
  },
  {
    id: 'monitoring',
    index: '05',
    title: 'Monitoring and Support',
    copy: 'System checks, fault finding, performance monitoring and ongoing technical support.',
    features: [
      'Generation and usage visibility',
      'Fault finding and callouts',
      'Performance checks',
      'Direct support line'
    ],
    cta: 'Set up monitoring'
  }
]
