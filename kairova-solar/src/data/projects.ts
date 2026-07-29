// DEMO PROJECTS. These are fictional demonstration case studies, not real installations.
import { images } from './images'

export interface Project {
  id: string
  name: string
  location: string
  type: string
  system: string
  objective: string
  stats: { label: string; value: string }[]
  image: string
  fallbackTint: string
}

export const projects: Project[] = [
  {
    id: 'atlantic-view',
    name: 'Atlantic View Residence',
    location: 'Blouberg, Cape Town',
    type: 'Residential',
    system: '8 kW solar with 10 kWh battery',
    objective: 'Reduce daytime grid usage and support essential circuits.',
    stats: [
      { label: 'Solar array', value: '8 kW' },
      { label: 'Battery', value: '10 kWh' },
      { label: 'Backed-up circuits', value: 'Essential' }
    ],
    image: images.projectAtlantic,
    fallbackTint: '#74BDE8'
  },
  {
    id: 'stellenbosch-estate',
    name: 'Stellenbosch Guest Estate',
    location: 'Stellenbosch',
    type: 'Hospitality',
    system: '24 kW commercial solar',
    objective: 'Offset daytime consumption across guest facilities.',
    stats: [
      { label: 'Solar array', value: '24 kW' },
      { label: 'Phases', value: 'Three' },
      { label: 'Focus', value: 'Daytime offset' }
    ],
    image: images.projectStellenbosch,
    fallbackTint: '#F5C84C'
  },
  {
    id: 'aurora-studio',
    name: 'Aurora Design Studio',
    location: 'Century City',
    type: 'Commercial office',
    system: '15 kW solar with battery storage',
    objective: 'Improve daytime energy control and maintain key workstations.',
    stats: [
      { label: 'Solar array', value: '15 kW' },
      { label: 'Storage', value: 'Battery backed' },
      { label: 'Priority', value: 'Workstations' }
    ],
    image: images.projectAurora,
    fallbackTint: '#C9F75A'
  }
]
