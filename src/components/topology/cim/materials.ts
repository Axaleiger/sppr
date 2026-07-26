/** Industrial CIM materials — Model Studio CS / CADLib aesthetic */

export const mat = {
  steel: '#8B929A',
  steelDark: '#5C636B',
  steelLight: '#B4BBC3',
  concrete: '#C8CCD1',
  concreteDark: '#A8ADB4',
  gravel: '#9EA3A8',
  building: '#E8EBEE',
  buildingRoof: '#6B7380',
  insulation: '#D6D0C4',
  safety: '#E8B923',
  handrail: '#F0C418',
  window: '#9BB8D0',
  foundation: '#B0B5BB',
  asphalt: '#5A5E63',
  earth: '#8A8578',
  plast: '#4A6B5C',
  plastDeep: '#2F4A3E',
} as const

/** Functional pipe colors (industrial / GOST-like) */
export const pipeMat = {
  oil: '#6B4423',
  gas: '#D4A017',
  water: '#2E8B57',
  power: '#4A90A4',
  info: '#7A8494',
  steam: '#C0392B',
  air: '#5DADE2',
} as const

export function steelProps(variant: 'light' | 'mid' | 'dark' = 'mid') {
  const color =
    variant === 'light' ? mat.steelLight : variant === 'dark' ? mat.steelDark : mat.steel
  return { color, metalness: 0.72, roughness: 0.32 }
}

export function concreteProps() {
  return { color: mat.concrete, metalness: 0.05, roughness: 0.92 }
}
