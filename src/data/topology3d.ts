import type { FlowKind, NodeKind, SchemeNodeData } from './topology'
import { isoEdges } from './topology'

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

/** Site coordinates — spaced for detailed CIM assemblies */
export const nodes3d: Topology3DNode[] = [
  {
    id: 'wells-1',
    position: { x: -16, y: 0, z: -8 },
    data: {
      label: 'СКВАЖИНЫ · КУСТ 12',
      kind: 'wells',
      status: 95,
      sparkline: [42, 48, 45, 52, 58, 55, 62],
    },
  },
  {
    id: 'wells-2',
    position: { x: -16, y: 0, z: 4 },
    data: {
      label: 'СКВАЖИНЫ · КУСТ 15',
      kind: 'wells',
      status: 88,
      sparkline: [30, 34, 38, 36, 40, 44, 42],
    },
  },
  {
    id: 'plast',
    position: { x: -16, y: 0, z: 12 },
    data: {
      label: 'ПЛАСТ',
      kind: 'plast',
      status: 70,
      subtitle: 'Резервуар',
      sparkline: [65, 66, 67, 68, 69, 70, 70],
    },
  },
  {
    id: 'upn',
    position: { x: -2, y: 0, z: -2 },
    data: {
      label: 'УПН',
      kind: 'upn',
      status: 92,
      sparkline: [70, 72, 68, 75, 78, 76, 80],
    },
  },
  {
    id: 'gtes',
    position: { x: 10, y: 0, z: -10 },
    data: {
      label: 'ГТЭС',
      kind: 'gtes',
      status: 97,
      sparkline: [80, 82, 85, 83, 88, 90, 89],
    },
  },
  {
    id: 'vl',
    position: { x: 10, y: 0, z: -2 },
    data: {
      label: 'ПС / ВЛ',
      kind: 'vl',
      status: 100,
      sparkline: [90, 90, 91, 90, 92, 91, 93],
    },
  },
  {
    id: 'ukpg',
    position: { x: 14, y: 0, z: 6 },
    data: {
      label: 'УКПГ',
      kind: 'ukpg',
      status: 91,
      sparkline: [55, 58, 60, 57, 62, 65, 63],
    },
  },
  {
    id: 'phg',
    position: { x: 14, y: 0, z: 16 },
    data: {
      label: 'ПХГ',
      kind: 'phg',
      status: 84,
      sparkline: [40, 42, 45, 48, 46, 50, 52],
    },
  },
]

export const edges3d = isoEdges.map((e) => ({
  id: e.id,
  source: e.source,
  target: e.target,
  kind: e.data.kind as FlowKind,
}))

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
