import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import { videoBars, videoDonuts, videoKpis } from '../data/assistant'
import { HierarchyFilters, type HierarchyState } from '../components/filters/HierarchyFilters'
import { BarPanel, DonutPanel } from '../components/charts/Charts'

const donutParts = [
  { name: 'HSE', value: 55, color: '#32ADE5' },
  { name: 'Техконтроль', value: 25, color: '#006CB1' },
  { name: 'Исполнение', value: 20, color: '#004374' },
]

export function AssistantLevel3() {
  const [filters, setFilters] = useState<HierarchyState>({
    subsidiary: 'gn-or',
    field: 'f-oren',
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Link to="/assistant" className="hover:text-gpn-sky">
            Уровень 1
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/assistant/production" className="hover:text-gpn-sky">
            Добыча
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">Видеоаналитика</span>
        </div>
        <Link
          to="/assistant/video/events"
          className="rounded-xl bg-energy px-4 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          Журнал событий
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold text-white">
        Инциденты видеоаналитики
      </h1>

      <div className="glass mt-4 rounded-2xl p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <input
            type="text"
            defaultValue="22.05.2024 — 21.06.2024"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none"
          />
        </div>
        <HierarchyFilters value={filters} onChange={setFilters} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-light rounded-2xl p-4"
        >
          <div className="text-xs text-gpn-muted">Всего</div>
          <div className="font-display text-4xl font-bold text-gpn-navy">{videoKpis.total}</div>
          <div className="mt-1 flex items-center gap-1 text-sm text-status-crit">
            <TrendingDown className="h-3.5 w-3.5" />
            {videoKpis.totalDelta}%
          </div>
        </motion.div>

        <div className="glass-light rounded-2xl p-4">
          <div className="text-xs text-gpn-muted">Статус</div>
          <div className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-status-ok">Закрыто</span>
              <span className="font-semibold text-gpn-ink">{videoKpis.closed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-status-warn">В работе</span>
              <span className="font-semibold text-gpn-ink">{videoKpis.inProgress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-status-crit">Открыто</span>
              <span className="font-semibold text-gpn-ink">{videoKpis.open}</span>
            </div>
          </div>
        </div>

        <div className="glass-light rounded-2xl p-4">
          <div className="text-xs text-gpn-muted">Контроль нарушений</div>
          <div className="mt-2 space-y-2">
            <div>
              <div className="flex justify-between text-sm">
                <span>Предупреждено</span>
                <span className="font-semibold">{videoKpis.warned}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-gpn-surface">
                <div className="h-full w-[86%] rounded-full bg-gpn-sky" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Устранено</span>
                <span className="font-semibold">{videoKpis.fixed}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-gpn-surface">
                <div className="h-full w-[59%] rounded-full bg-energy" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-light rounded-2xl p-4">
          <div className="text-xs text-gpn-muted">Соотношение по категориям</div>
          <div className="mt-1 h-28">
            <DonutPanel data={videoKpis.categories} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {videoDonuts.map((d, i) => (
          <motion.div
            key={d.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="glass-light rounded-2xl p-3"
          >
            <div className="text-xs font-medium text-gpn-navy">{d.title}</div>
            <div className="relative mx-auto h-28 w-28">
              <DonutPanel data={donutParts} center={String(d.total)} />
            </div>
            <div
              className={`mt-1 flex items-center justify-center gap-1 text-xs ${
                d.delta >= 0 ? 'text-status-ok' : 'text-status-crit'
              }`}
            >
              {d.delta >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {d.delta > 0 ? '+' : ''}
              {d.delta}%
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-light mt-4 rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-gpn-navy">
            Общая статистика
          </h2>
          <select className="rounded-lg border border-gpn-navy/15 bg-white px-3 py-1.5 text-sm text-gpn-ink">
            <option>Все категории</option>
          </select>
        </div>
        <div className="h-64">
          <BarPanel
            data={videoBars}
            keys={['area', 'cluster', 'transport', 'drill', 'capex']}
            colors={['#32ADE5', '#006CB1', '#FF6A00', '#E8B923', '#7C5CFC']}
            stacked
          />
        </div>
      </div>
    </div>
  )
}
