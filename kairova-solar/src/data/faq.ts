export interface FaqItem {
  q: string
  a: string
}

export const faq: FaqItem[] = [
  {
    q: 'How is a solar system sized?',
    a: 'Sizing starts with how the property uses electricity: monthly consumption, when usage happens during the day, and which circuits matter most. Roof space, orientation and shading then shape the final panel layout. A site assessment confirms the numbers before anything is ordered.'
  },
  {
    q: 'Will solar work during a power interruption?',
    a: 'Panels alone switch off during an interruption for safety. With a hybrid inverter and battery, selected circuits keep running automatically. Which circuits stay on is decided during system design.'
  },
  {
    q: 'Is a battery required?',
    a: 'No. A solar-only system reduces daytime grid usage and works well for properties that use most of their electricity during the day. A battery adds evening cover and backup during interruptions.'
  },
  {
    q: 'Can battery capacity be expanded later?',
    a: 'Yes, if the system is designed for it. We specify inverters and battery ranges that accept additional modules, so you can start with what you need now and add capacity when your usage changes.'
  },
  {
    q: 'What happens during cloudy weather?',
    a: 'Panels still generate, just at reduced output. The property draws the difference from the battery or the grid automatically. Monitoring shows exactly how much each source contributed.'
  },
  {
    q: 'Can an existing system be upgraded?',
    a: 'Usually. We assess the current panels, inverter, wiring and battery, then recommend what to keep, replace or add. Some older inverters limit expansion, which the assessment will flag before you commit.'
  },
  {
    q: 'How long does installation take?',
    a: 'Most residential systems take one to three days on site. Commercial installations depend on system size and roof access, and are scheduled to limit disruption to operations.'
  },
  {
    q: 'What can system monitoring show?',
    a: 'Generation, consumption, battery level and grid usage, live and over time. It also helps support pick up faults early, often before you notice anything at the property.'
  }
]
