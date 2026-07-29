// All external image references live here so they can be replaced in one place.
// The layout keeps its own SVG/tinted backdrop behind every image, so the site
// still looks complete if any of these URLs stop resolving.

export const images = {
  projectAtlantic:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
  projectStellenbosch:
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=80',
  projectAurora:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'
} as const
