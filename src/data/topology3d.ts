import type { FlowKind, NodeKind, SchemeNodeData } from './topology'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Topology3DNode {
  id: string
  position: Vec3
  data: SchemeNodeData
}

/**
 * Expanded CPS-scale network (Novoportovskoye / Giprotyumenneftegaz style):
 * well pads → gathering → DNS → CPPN → export + power/gas loops
 * @see https://sapr.ru/article/25656
 */
export const nodes3d: Topology3DNode[] = [
  // Well pads
  { id: 'k12', position: { x: -28, y: 0, z: -14 }, data: { label: 'КУСТ 12', kind: 'wells', status: 95 } },
  { id: 'k15', position: { x: -28, y: 0, z: -2 }, data: { label: 'КУСТ 15', kind: 'wells', status: 91 } },
  { id: 'k21', position: { x: -28, y: 0, z: 10 }, data: { label: 'КУСТ 21', kind: 'wells', status: 88 } },
  { id: 'k28', position: { x: -28, y: 0, z: 22 }, data: { label: 'КУСТ 28', kind: 'wells', status: 86 } },
  { id: 'plast', position: { x: -36, y: 0, z: 4 }, data: { label: 'ПЛАСТ', kind: 'plast', status: 72, subtitle: 'Резервуар' } },

  // Gathering / treatment chain (ЦПС)
  { id: 'dns1', position: { x: -12, y: 0, z: -8 }, data: { label: 'ДНС-1 УПСВ', kind: 'dns', status: 90 } },
  { id: 'dns2', position: { x: -12, y: 0, z: 12 }, data: { label: 'ДНС-2', kind: 'dns', status: 87 } },
  { id: 'upn', position: { x: 2, y: 0, z: 0 }, data: { label: 'УПН / ЦПС', kind: 'upn', status: 93 } },
  { id: 'cppn', position: { x: 16, y: 0, z: -6 }, data: { label: 'ЦППН · ПСП', kind: 'cppn', status: 94 } },
  { id: 'tank', position: { x: 8, y: 0, z: -16 }, data: { label: 'Рез. парк', kind: 'phg', status: 89 } },

  // Gas loop
  { id: 'ukpg', position: { x: 16, y: 0, z: 10 }, data: { label: 'УКПГ', kind: 'ukpg', status: 91 } },
  { id: 'ks', position: { x: 28, y: 0, z: 14 }, data: { label: 'КС', kind: 'ks', status: 88 } },
  { id: 'phg', position: { x: 28, y: 0, z: 26 }, data: { label: 'ПХГ', kind: 'phg', status: 82 } },

  // Power
  { id: 'gtes', position: { x: 8, y: 0, z: 20 }, data: { label: 'ГТЭС', kind: 'gtes', status: 97 } },
  { id: 'ps', position: { x: 20, y: 0, z: -16 }, data: { label: 'ПС 110 кВ', kind: 'ps', status: 99 } },
  { id: 'vl', position: { x: 32, y: 0, z: -10 }, data: { label: 'ВЛ', kind: 'vl', status: 100 } },
  { id: 'pns', position: { x: -4, y: 0, z: 20 }, data: { label: 'ПНС', kind: 'pns', status: 90 } },

  // External / export
  { id: 'transneft', position: { x: 30, y: 0, z: -22 }, data: { label: 'ТРАНСНЕФТЬ', kind: 'external', status: 100 } },
  { id: 'gazprom', position: { x: 38, y: 0, z: 20 }, data: { label: 'ГАЗПРОМ', kind: 'external', status: 100 } },
  { id: 'rosseti', position: { x: 38, y: 0, z: -4 }, data: { label: 'РОССЕТИ', kind: 'external', status: 100 } },
]

export const edges3d: Array<{ id: string; source: string; target: string; kind: FlowKind }> = [
  // Oil gathering
  { id: 'o1', source: 'k12', target: 'dns1', kind: 'oil' },
  { id: 'o2', source: 'k15', target: 'dns1', kind: 'oil' },
  { id: 'o3', source: 'k21', target: 'dns2', kind: 'oil' },
  { id: 'o4', source: 'k28', target: 'dns2', kind: 'oil' },
  { id: 'o5', source: 'dns1', target: 'upn', kind: 'oil' },
  { id: 'o6', source: 'dns2', target: 'upn', kind: 'oil' },
  { id: 'o7', source: 'upn', target: 'cppn', kind: 'oil' },
  { id: 'o8', source: 'cppn', target: 'transneft', kind: 'oil' },
  { id: 'o9', source: 'upn', target: 'tank', kind: 'oil' },
  // Gas
  { id: 'g1', source: 'dns1', target: 'ukpg', kind: 'gas' },
  { id: 'g2', source: 'dns2', target: 'ukpg', kind: 'gas' },
  { id: 'g3', source: 'upn', target: 'ukpg', kind: 'gas' },
  { id: 'g4', source: 'ukpg', target: 'ks', kind: 'gas' },
  { id: 'g5', source: 'ks', target: 'gazprom', kind: 'gas' },
  { id: 'g6', source: 'ks', target: 'phg', kind: 'gas' },
  { id: 'g7', source: 'gtes', target: 'ukpg', kind: 'gas' },
  // Water
  { id: 'w1', source: 'upn', target: 'pns', kind: 'water' },
  { id: 'w2', source: 'pns', target: 'k21', kind: 'water' },
  { id: 'w3', source: 'plast', target: 'k15', kind: 'water' },
  { id: 'w4', source: 'k12', target: 'plast', kind: 'oil' },
  // Power
  { id: 'p1', source: 'rosseti', target: 'vl', kind: 'power' },
  { id: 'p2', source: 'vl', target: 'ps', kind: 'power' },
  { id: 'p3', source: 'gtes', target: 'ps', kind: 'power' },
  { id: 'p4', source: 'ps', target: 'upn', kind: 'power' },
  { id: 'p5', source: 'ps', target: 'dns1', kind: 'power' },
  { id: 'p6', source: 'ps', target: 'ukpg', kind: 'power' },
  { id: 'p7', source: 'ps', target: 'pns', kind: 'power' },
]

export const kindColors: Record<NodeKind, string> = {
  wells: '#6B7280',
  upn: '#8B929A',
  gtes: '#6B7280',
  vl: '#8B929A',
  ukpg: '#8B929A',
  phg: '#8B929A',
  plast: '#4A6B5C',
  dns: '#8B929A',
  cppn: '#8B929A',
  ks: '#8B929A',
  ps: '#8B929A',
  pns: '#8B929A',
  cluster: '#6B7280',
  arm: '#B4BBC3',
  external: '#A8ADB4',
}
