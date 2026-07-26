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

/** World positions for cinematic isometric-like 3D layout */
export const nodes3d: Topology3DNode[] = [
  {
    id: 'wells-1',
    position: { x: -8, y: 0, z: -4 },
    data: {
      label: 'СКВАЖИНЫ',
      kind: 'wells',
      status: 95,
      sparkline: [42, 48, 45, 52, 58, 55, 62],
    },
  },
  {
    id: 'wells-2',
    position: { x: -8, y: 0, z: 2 },
    data: {
      label: 'СКВАЖИНЫ',
      kind: 'wells',
      status: 88,
      sparkline: [30, 34, 38, 36, 40, 44, 42],
    },
  },
  {
    id: 'plast',
    position: { x: -8, y: -1.2, z: 6 },
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
    position: { x: -1, y: 0, z: -1 },
    data: {
      label: 'УПН',
      kind: 'upn',
      status: 92,
      sparkline: [70, 72, 68, 75, 78, 76, 80],
    },
  },
  {
    id: 'gtes',
    position: { x: 4, y: 0, z: -5 },
    data: {
      label: 'ГТЭС',
      kind: 'gtes',
      status: 97,
      sparkline: [80, 82, 85, 83, 88, 90, 89],
    },
  },
  {
    id: 'vl',
    position: { x: 4, y: 0, z: -1 },
    data: {
      label: 'ВЛ',
      kind: 'vl',
      status: 100,
      sparkline: [90, 90, 91, 90, 92, 91, 93],
    },
  },
  {
    id: 'ukpg',
    position: { x: 9, y: 0, z: -1 },
    data: {
      label: 'УКПГ',
      kind: 'ukpg',
      status: 91,
      sparkline: [55, 58, 60, 57, 62, 65, 63],
    },
  },
  {
    id: 'phg',
    position: { x: 9, y: 0, z: 5 },
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
  wells: '#32ADE5',
  upn: '#006CB1',
  gtes: '#FF6A00',
  vl: '#E8B923',
  ukpg: '#006CB1',
  phg: '#5BBEDE',
  plast: '#004374',
  dns: '#006CB1',
  cppn: '#006CB1',
  ks: '#E8B923',
  ps: '#32ADE5',
  pns: '#5BBEDE',
  cluster: '#32ADE5',
  arm: '#8A96A8',
  external: '#8A96A8',
}
