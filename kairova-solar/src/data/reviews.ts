// SAMPLE CONTENT. These reviews are fictional and written for this demo only.

export interface Review {
  id: string
  initials: string
  name: string
  location: string
  projectType: string
  text: string
  tint: string
}

export const reviews: Review[] = [
  {
    id: 'r1',
    initials: 'LM',
    name: 'L. Mokoena',
    location: 'Durbanville',
    projectType: 'Residential solar + battery',
    text: 'Kairova explained the difference between increasing our panel capacity and adding another battery. The final proposal was much easier to understand than the others we received.',
    tint: '#F5C84C'
  },
  {
    id: 'r2',
    initials: 'JV',
    name: 'J. van der Berg',
    location: 'Somerset West',
    projectType: 'Battery backup',
    text: 'Install took a day and a half instead of the one day quoted, but they told us in advance and the switchover testing was thorough. The essential circuits have carried us through every interruption since.',
    tint: '#74BDE8'
  },
  {
    id: 'r3',
    initials: 'AP',
    name: 'A. Petersen',
    location: 'Blouberg',
    projectType: 'Residential solar',
    text: 'The assessment looked at our actual usage from the meter, not just the size of the roof. The system they suggested was smaller and cheaper than two other quotes, and it covers what we need.',
    tint: '#C9F75A'
  },
  {
    id: 'r4',
    initials: 'NK',
    name: 'N. Khumalo',
    location: 'Southern Suburbs',
    projectType: 'System upgrade',
    text: 'We had an older system another company installed. Kairova sorted out the wiring, added two panels and got the monitoring working properly. Wish the app had been set up on day one, but support fixed it quickly.',
    tint: '#F5C84C'
  },
  {
    id: 'r5',
    initials: 'RD',
    name: 'R. Daniels',
    location: 'Stellenbosch',
    projectType: 'Commercial solar',
    text: 'Straightforward process from site visit to handover. The monthly generation report is what convinced our finance team the numbers in the proposal were realistic.',
    tint: '#74BDE8'
  }
]
