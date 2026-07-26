export interface DomainCard {
  id: string
  title: string
  badge: string
  path: string
  span: string
  charts: 'production' | 'energy' | 'capex' | 'hr' | 'hse' | 'economy'
}

export const level1Domains: DomainCard[] = [
  { id: 'prod', title: 'Добыча', badge: 'Добыча', path: '/assistant/production', span: 'col-span-2 row-span-2', charts: 'production' },
  { id: 'energy', title: 'Энергетика + Газ', badge: 'Энергетика + ГАЗ', path: '/assistant/production', span: 'col-span-1', charts: 'energy' },
  { id: 'capex', title: 'Капитальное строительство', badge: 'Капстрой', path: '/scheme', span: 'col-span-1', charts: 'capex' },
  { id: 'hr', title: 'HR', badge: 'HR', path: '/assistant/production', span: 'col-span-1', charts: 'hr' },
  { id: 'hse', title: 'HSE', badge: 'HSE', path: '/assistant/video', span: 'col-span-1', charts: 'hse' },
  { id: 'econ', title: 'Экономика', badge: 'Экономика', path: '/assistant/production', span: 'col-span-2', charts: 'economy' },
]

export const productionWidgets = [
  { id: 'bp', title: 'Выполнение БП', size: 'lg' },
  { id: 'disp', title: 'Диспетчеризация', size: 'sm' },
  { id: 'video', title: 'Видеоаналитика', size: 'md', link: '/assistant/video' },
  { id: 'econ', title: 'Экономика и рентабельность', size: 'md' },
  { id: 'fund', title: 'Базовый фонд', size: 'lg' },
  { id: 'inj', title: 'Закачка', size: 'sm' },
  { id: 'pot', title: 'Потенциал', size: 'sm' },
  { id: 'drill', title: 'Бурение и ВСР', size: 'sm' },
  { id: 'kpi', title: 'Каскад КПЭ', size: 'md' },
]

export const series = (seed: number, n = 12, base = 40, amp = 20) =>
  Array.from({ length: n }, (_, i) => ({
    x: i + 1,
    a: Math.round(base + Math.sin((i + seed) * 0.7) * amp + i * 1.2),
    b: Math.round(base * 0.8 + Math.cos((i + seed) * 0.5) * amp * 0.6),
    c: Math.round(base * 0.5 + Math.sin((i + seed) * 0.3) * amp * 0.4),
  }))

export const videoKpis = {
  total: 532,
  totalDelta: -24.5,
  closed: 425,
  inProgress: 67,
  open: 40,
  warned: 456,
  fixed: 315,
  categories: [
    { name: 'HSE', value: 72, color: '#32ADE5' },
    { name: 'Тех. контроль', value: 16, color: '#006CB1' },
    { name: 'Контроль исполнения', value: 12, color: '#004374' },
  ],
}

export const videoDonuts = [
  { title: 'По площадным объектам', total: 164, delta: 8.2 },
  { title: 'По кустовым площадкам', total: 74, delta: -3.1 },
  { title: 'По транспорту', total: 138, delta: 12.4 },
  { title: 'По бурению и ТКРС', total: 86, delta: 2.0 },
  { title: 'По капитальному строительству', total: 70, delta: -1.5 },
]

export const videoBars = [
  { name: '22.05–21.06', area: 40, cluster: 22, transport: 35, drill: 18, capex: 15 },
  { name: '22.06–21.07', area: 48, cluster: 18, transport: 30, drill: 24, capex: 12 },
  { name: '22.07–21.08', area: 36, cluster: 28, transport: 42, drill: 20, capex: 18 },
  { name: '22.08–21.09', area: 52, cluster: 20, transport: 28, drill: 16, capex: 14 },
  { name: '22.09–21.10', area: 44, cluster: 26, transport: 38, drill: 22, capex: 20 },
]

export type EventStatus = 'open' | 'progress' | 'closed'

export interface VideoEvent {
  id: string
  time: string
  description: string
  category: string
  direction: string
  well: string
  responsible: string
  status: EventStatus
  priority: 'low' | 'medium' | 'high'
}

export const videoEvents: VideoEvent[] = [
  {
    id: 'EVT-10482',
    time: '21.06.2024 14:32',
    description: 'Обнаружен человек не в синей спецодежде',
    category: 'HSE · Персонал',
    direction: 'Кустовая площадка',
    well: 'Скв. 12',
    responsible: 'И. Петров',
    status: 'open',
    priority: 'high',
  },
  {
    id: 'EVT-10471',
    time: '21.06.2024 13:18',
    description: 'Превышение скорости при подъёме/спуске',
    category: 'Тех. контроль',
    direction: 'Бурение',
    well: 'Скв. 21',
    responsible: 'А. Смирнов',
    status: 'progress',
    priority: 'medium',
  },
  {
    id: 'EVT-10455',
    time: '21.06.2024 11:05',
    description: 'Отсутствие каски в зоне работ',
    category: 'HSE · Персонал',
    direction: 'Капстрой',
    well: '—',
    responsible: 'М. Орлова',
    status: 'closed',
    priority: 'low',
  },
  {
    id: 'EVT-10440',
    time: '20.06.2024 18:44',
    description: 'Нарушение периметра ограждения',
    category: 'Контроль исполнения',
    direction: 'Площадной объект',
    well: 'Куст 15',
    responsible: 'Д. Козлов',
    status: 'progress',
    priority: 'high',
  },
  {
    id: 'EVT-10422',
    time: '20.06.2024 09:12',
    description: 'Транспорт вне разрешённой зоны',
    category: 'HSE · Техника',
    direction: 'Транспорт',
    well: '—',
    responsible: 'Е. Волкова',
    status: 'closed',
    priority: 'medium',
  },
  {
    id: 'EVT-10401',
    time: '19.06.2024 16:27',
    description: 'Дым в зоне резервуарного парка',
    category: 'HSE · Пожарная',
    direction: 'Площадной объект',
    well: 'ЦПС',
    responsible: 'С. Иванов',
    status: 'closed',
    priority: 'high',
  },
]
