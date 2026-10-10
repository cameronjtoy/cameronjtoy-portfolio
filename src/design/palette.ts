// Colours for 3D scenes. They sit on the page background in both light and
// dark themes, so they stay mid-toned and saturated.
export const palette = {
  orange: '#e8590c',
  amber: '#f59f00',
  teal: '#0c8599',
  blue: '#3b5bdb',
  green: '#2f9e44',
  plum: '#9c36b5',
  steel: '#868e96',
  ink: '#212529',
  paper: '#f1ede6',
  grass: '#8fae5d',
  pine: '#3f7d4e',
  haze: '#7f9ba6',
  sky: '#cfe4ef',
  wood: '#7a5a3a',
  gravel: '#a89f91',
  yellow: '#fcc419',
  rust: '#a3472a',
  white: '#f8f9fa',
  graphite: '#3b4046',
  soil: '#6b4f3a',
} as const

export type PaletteColor = keyof typeof palette
