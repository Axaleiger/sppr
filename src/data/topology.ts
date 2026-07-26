export type HierarchyLevel =
  | 'subsidiary'
  | 'field'
  | 'area'
  | 'cluster'
  | 'well'

export interface HierarchyOption {
  id: string
  label: string
  parentId?: string
}

export const hierarchy: Record<HierarchyLevel, HierarchyOption[]> = {
  subsidiary: [
    { id: 'gn-or', label: 'Газпромнефть-Оренбург' },
    { id: 'gn-ya', label: 'Газпромнефть-Ямал' },
    { id: 'gn-hn', label: 'Газпромнефть-Хантос' },
  ],
  field: [
    { id: 'f-oren', label: 'Оренбургское', parentId: 'gn-or' },
    { id: 'f-tsap', label: 'Царичанское', parentId: 'gn-or' },
    { id: 'f-novo', label: 'Новопортовское', parentId: 'gn-ya' },
  ],
  area: [
    { id: 'a-1', label: 'Площадка ЦПС', parentId: 'f-oren' },
    { id: 'a-2', label: 'Площадка УКПГ', parentId: 'f-oren' },
    { id: 'a-3', label: 'Площадка бурения', parentId: 'f-oren' },
  ],
  cluster: [
    { id: 'c-12', label: 'Куст 12', parentId: 'a-1' },
    { id: 'c-15', label: 'Куст 15', parentId: 'a-1' },
    { id: 'c-21', label: 'Куст 21', parentId: 'a-3' },
  ],
  well: [
    { id: 'w-1201', label: 'Скв. 1201', parentId: 'c-12' },
    { id: 'w-1202', label: 'Скв. 1202', parentId: 'c-12' },
    { id: 'w-1503', label: 'Скв. 1503', parentId: 'c-15' },
  ],
}

export type FlowKind = 'oil' | 'gas' | 'water' | 'power' | 'info'

export const flowColors: Record<FlowKind, string> = {
  oil: '#8B5A2B',
  gas: '#E8B923',
  water: '#5BBEDE',
  power: '#32ADE5',
  info: '#8A96A8',
}

export interface ObjectTelemetry {
  status: number
  trend: number[]
  metrics: { label: string; value: string; unit?: string }[]
  whatIf?: { label: string; value: string; delta: string }[]
}

export type NodeKind =
  | 'wells'
  | 'upn'
  | 'gtes'
  | 'vl'
  | 'ukpg'
  | 'phg'
  | 'plast'
  | 'dns'
  | 'cppn'
  | 'ks'
  | 'ps'
  | 'pns'
  | 'cluster'
  | 'arm'
  | 'external'

export interface SchemeNodeData extends Record<string, unknown> {
  label: string
  kind: NodeKind
  status: number
  subtitle?: string
  sparkline?: number[]
}

export const isoNodes = [
  { id: 'wells-1', position: { x: 80, y: 120 }, data: { label: 'СКВАЖИНЫ', kind: 'wells' as const, status: 95, sparkline: [42, 48, 45, 52, 58, 55, 62] } },
  { id: 'wells-2', position: { x: 80, y: 320 }, data: { label: 'СКВАЖИНЫ', kind: 'wells' as const, status: 88, sparkline: [30, 34, 38, 36, 40, 44, 42] } },
  { id: 'upn', position: { x: 380, y: 200 }, data: { label: 'УПН', kind: 'upn' as const, status: 92, sparkline: [70, 72, 68, 75, 78, 76, 80] } },
  { id: 'gtes', position: { x: 700, y: 80 }, data: { label: 'ГТЭС', kind: 'gtes' as const, status: 97, sparkline: [80, 82, 85, 83, 88, 90, 89] } },
  { id: 'vl', position: { x: 700, y: 260 }, data: { label: 'ВЛ', kind: 'vl' as const, status: 100, sparkline: [90, 90, 91, 90, 92, 91, 93] } },
  { id: 'ukpg', position: { x: 980, y: 180 }, data: { label: 'УКПГ', kind: 'ukpg' as const, status: 91, sparkline: [55, 58, 60, 57, 62, 65, 63] } },
  { id: 'phg', position: { x: 980, y: 380 }, data: { label: 'ПХГ', kind: 'phg' as const, status: 84, sparkline: [40, 42, 45, 48, 46, 50, 52] } },
  { id: 'plast', position: { x: 80, y: 520 }, data: { label: 'ПЛАСТ', kind: 'plast' as const, status: 70, subtitle: 'Резервуар', sparkline: [65, 66, 67, 68, 69, 70, 70] } },
]

export const isoEdges = [
  { id: 'e1', source: 'wells-1', target: 'upn', data: { kind: 'oil' as FlowKind } },
  { id: 'e2', source: 'wells-2', target: 'upn', data: { kind: 'oil' as FlowKind } },
  { id: 'e3', source: 'upn', target: 'ukpg', data: { kind: 'gas' as FlowKind } },
  { id: 'e4', source: 'gtes', target: 'vl', data: { kind: 'power' as FlowKind } },
  { id: 'e5', source: 'vl', target: 'upn', data: { kind: 'power' as FlowKind } },
  { id: 'e6', source: 'vl', target: 'ukpg', data: { kind: 'power' as FlowKind } },
  { id: 'e7', source: 'ukpg', target: 'phg', data: { kind: 'gas' as FlowKind } },
  { id: 'e8', source: 'plast', target: 'wells-2', data: { kind: 'oil' as FlowKind } },
  { id: 'e9', source: 'wells-1', target: 'plast', data: { kind: 'water' as FlowKind } },
]

export const techNodes = [
  { id: 'arm-cud', position: { x: 120, y: 20 }, data: { label: 'АРМ ЦУД', kind: 'arm' as const, status: 100, subtitle: 'EAPM / ГибриМА' } },
  { id: 'arm-sppr', position: { x: 720, y: 20 }, data: { label: 'Оркестратор СППР', kind: 'arm' as const, status: 100, subtitle: 'АРМ Энергетик' } },
  { id: 'cluster', position: { x: 40, y: 180 }, data: { label: 'Кустовая площадка', kind: 'cluster' as const, status: 93, subtitle: 'Газ/ГК 50% · ЭЦН 95%' } },
  { id: 'dns', position: { x: 360, y: 220 }, data: { label: 'ДНС с УПСВ', kind: 'dns' as const, status: 89 } },
  { id: 'cppn', position: { x: 640, y: 220 }, data: { label: 'ЦППН и ПСП', kind: 'cppn' as const, status: 94 } },
  { id: 'ukpg-t', position: { x: 360, y: 400 }, data: { label: 'УКПГ', kind: 'ukpg' as const, status: 91 } },
  { id: 'ks', position: { x: 640, y: 400 }, data: { label: 'КС', kind: 'ks' as const, status: 87 } },
  { id: 'ps', position: { x: 900, y: 180 }, data: { label: 'ПС', kind: 'ps' as const, status: 98 } },
  { id: 'pns', position: { x: 900, y: 340 }, data: { label: 'ПНС', kind: 'pns' as const, status: 90 } },
  { id: 'phg-t', position: { x: 640, y: 540 }, data: { label: 'ПХГ', kind: 'phg' as const, status: 82 } },
  { id: 'plast-t', position: { x: 40, y: 420 }, data: { label: 'Пласт', kind: 'plast' as const, status: 70 } },
  { id: 'rosseti', position: { x: 1120, y: 120 }, data: { label: 'РОССЕТИ', kind: 'external' as const, status: 100 } },
  { id: 'transneft', position: { x: 900, y: 60 }, data: { label: 'ТРАНСНЕФТЬ', kind: 'external' as const, status: 100 } },
  { id: 'gazprom', position: { x: 900, y: 520 }, data: { label: 'ГАЗПРОМ', kind: 'external' as const, status: 100 } },
]

export const techEdges = [
  { id: 'te1', source: 'arm-cud', target: 'cluster', data: { kind: 'info' as FlowKind } },
  { id: 'te2', source: 'arm-sppr', target: 'ps', data: { kind: 'info' as FlowKind } },
  { id: 'te3', source: 'plast-t', target: 'cluster', data: { kind: 'oil' as FlowKind } },
  { id: 'te4', source: 'cluster', target: 'dns', data: { kind: 'oil' as FlowKind } },
  { id: 'te5', source: 'cluster', target: 'dns', data: { kind: 'gas' as FlowKind } },
  { id: 'te6', source: 'dns', target: 'cppn', data: { kind: 'oil' as FlowKind } },
  { id: 'te7', source: 'dns', target: 'ukpg-t', data: { kind: 'gas' as FlowKind } },
  { id: 'te8', source: 'dns', target: 'pns', data: { kind: 'water' as FlowKind } },
  { id: 'te9', source: 'cppn', target: 'transneft', data: { kind: 'oil' as FlowKind } },
  { id: 'te10', source: 'ukpg-t', target: 'ks', data: { kind: 'gas' as FlowKind } },
  { id: 'te11', source: 'ks', target: 'gazprom', data: { kind: 'gas' as FlowKind } },
  { id: 'te12', source: 'ks', target: 'phg-t', data: { kind: 'gas' as FlowKind } },
  { id: 'te13', source: 'rosseti', target: 'ps', data: { kind: 'power' as FlowKind } },
  { id: 'te14', source: 'ps', target: 'cluster', data: { kind: 'power' as FlowKind } },
  { id: 'te15', source: 'ps', target: 'dns', data: { kind: 'power' as FlowKind } },
  { id: 'te16', source: 'ps', target: 'pns', data: { kind: 'power' as FlowKind } },
]

export const objectDetails: Record<string, ObjectTelemetry> = {
  'wells-1': {
    status: 95,
    trend: [42, 48, 45, 52, 58, 55, 62, 64],
    metrics: [
      { label: 'Дебит жидкости', value: '186', unit: 'м³/сут' },
      { label: 'Обводнённость', value: '34', unit: '%' },
      { label: 'Давление буфера', value: '28', unit: 'атм' },
    ],
    whatIf: [
      { label: 'Дебит при +5% ЧЧ', value: '198', delta: '+6.5%' },
      { label: 'Энергозатраты', value: '−4%', delta: 'оптимум' },
    ],
  },
  upn: {
    status: 92,
    trend: [70, 72, 68, 75, 78, 76, 80, 81],
    metrics: [
      { label: 'Приём нефти', value: '4120', unit: 'т/сут' },
      { label: 'Качество', value: '0.42', unit: '% воды' },
      { label: 'Загрузка', value: '92', unit: '%' },
    ],
    whatIf: [
      { label: 'Маршрут через ДНС-2', value: '+3%', delta: 'FCF' },
    ],
  },
  gtes: {
    status: 97,
    trend: [80, 82, 85, 83, 88, 90, 89, 91],
    metrics: [
      { label: 'Выработка', value: '48.2', unit: 'МВт' },
      { label: 'КПД', value: '37.4', unit: '%' },
      { label: 'Резерв', value: '12', unit: 'МВт' },
    ],
  },
  ukpg: {
    status: 91,
    trend: [55, 58, 60, 57, 62, 65, 63, 66],
    metrics: [
      { label: 'Приём газа', value: '2.1', unit: 'млн м³/сут' },
      { label: 'Точка росы', value: '−18', unit: '°C' },
    ],
  },
  cluster: {
    status: 93,
    trend: [50, 52, 55, 54, 58, 60, 59, 61],
    metrics: [
      { label: 'Скважин в работе', value: '14', unit: 'шт' },
      { label: 'Суммарный дебит', value: '980', unit: 'т/сут' },
    ],
    whatIf: [{ label: 'Запуск скв. 1204', value: '+45 т', delta: '+4.6%' }],
  },
}

export function getObjectDetail(id: string): ObjectTelemetry {
  return (
    objectDetails[id] ?? {
      status: 90,
      trend: [40, 45, 42, 50, 48, 55, 52, 58],
      metrics: [
        { label: 'Загрузка', value: '90', unit: '%' },
        { label: 'Доступность', value: '99.1', unit: '%' },
        { label: 'Алертов', value: '2', unit: 'шт' },
      ],
      whatIf: [{ label: 'Оптимизация режима', value: '+2.4%', delta: 'эффект' }],
    }
  )
}
