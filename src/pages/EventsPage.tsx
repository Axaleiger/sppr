import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Play } from 'lucide-react'
import { videoEvents, type EventStatus } from '../data/assistant'
import { HierarchyFilters, type HierarchyState } from '../components/filters/HierarchyFilters'
import { cn } from '../lib/utils'

const statusBar: Record<EventStatus, string> = {
  open: 'bg-status-crit',
  progress: 'bg-status-warn',
  closed: 'bg-status-ok',
}

const statusLabel: Record<EventStatus, string> = {
  open: 'Открыто',
  progress: 'В работе',
  closed: 'Подтверждено',
}

export function EventsPage() {
  const [filters, setFilters] = useState<HierarchyState>({ subsidiary: 'gn-or' })
  const [selected, setSelected] = useState(videoEvents[0].id)
  const event = videoEvents.find((e) => e.id === selected)!

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-white/50">
        <Link to="/assistant/video" className="hover:text-gpn-sky">
          Видеоаналитика
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white">Журнал событий</span>
      </div>

      <h1 className="font-display text-3xl font-bold text-white">Журнал событий</h1>

      <div className="glass mt-4 rounded-2xl p-4">
        <HierarchyFilters value={filters} onChange={setFilters} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <div className="glass-light overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gpn-surface text-xs uppercase tracking-wide text-gpn-muted">
                <tr>
                  <th className="px-3 py-3 w-2" />
                  <th className="px-3 py-3">Время</th>
                  <th className="px-3 py-3">Событие</th>
                  <th className="px-3 py-3">Категория</th>
                  <th className="px-3 py-3">Направление</th>
                  <th className="px-3 py-3">Скважина</th>
                  <th className="px-3 py-3">Ответственный</th>
                </tr>
              </thead>
              <tbody>
                {videoEvents.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelected(e.id)}
                    className={cn(
                      'cursor-pointer border-t border-black/5 transition',
                      selected === e.id ? 'bg-gpn-sky/10' : 'hover:bg-gpn-surface/70',
                    )}
                  >
                    <td className="px-1 py-3">
                      <span className={cn('ml-2 block h-8 w-1 rounded-full', statusBar[e.status])} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gpn-ink/80">{e.time}</td>
                    <td className="px-3 py-3 text-gpn-ink font-medium">{e.description}</td>
                    <td className="px-3 py-3 text-gpn-muted">{e.category}</td>
                    <td className="px-3 py-3 text-gpn-muted">{e.direction}</td>
                    <td className="px-3 py-3 text-gpn-muted">{e.well}</td>
                    <td className="px-3 py-3 text-gpn-ink">{e.responsible}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-black/5 px-4 py-2 text-center text-xs text-gpn-muted">
            1 из 100
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.aside
            key={event.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="glass-light rounded-2xl p-4"
          >
            <div className="font-display text-xl font-semibold text-gpn-navy">
              {event.description}
            </div>
            <div className="mt-1 text-xs text-gpn-muted">{event.id}</div>

            <div className="mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-gpn-navy to-gpn-deep">
              <div className="relative h-36">
                <div className="absolute inset-4 rounded-lg border-2 border-status-crit/70" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/80">
                  <span>Кадр детекции</span>
                  <button type="button" className="inline-flex items-center gap-1 text-gpn-sky">
                    <Play className="h-3.5 w-3.5" /> Смотреть видео
                  </button>
                </div>
              </div>
            </div>

            <select
              className="mt-4 w-full rounded-xl border border-gpn-navy/15 bg-white px-3 py-2.5 text-sm font-medium text-gpn-ink"
              defaultValue={event.status}
            >
              <option value="closed">Подтверждено</option>
              <option value="progress">В работе</option>
              <option value="open">Открыто</option>
            </select>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-gpn-muted">Приоритет</div>
                <div
                  className={cn(
                    'font-medium capitalize',
                    event.priority === 'high'
                      ? 'text-status-crit'
                      : event.priority === 'medium'
                        ? 'text-status-warn'
                        : 'text-status-ok',
                  )}
                >
                  {event.priority === 'high'
                    ? 'Высокий'
                    : event.priority === 'medium'
                      ? 'Средний'
                      : 'Низкий'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gpn-muted">Статус</div>
                <div className="font-medium text-gpn-ink">{statusLabel[event.status]}</div>
              </div>
              <div>
                <div className="text-xs text-gpn-muted">Ответственный</div>
                <div className="font-medium text-gpn-ink">{event.responsible}</div>
              </div>
              <div>
                <div className="text-xs text-gpn-muted">Объект</div>
                <div className="font-medium text-gpn-ink">{event.well}</div>
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-xs text-gpn-muted">Комментарий</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-gpn-navy/15 bg-white p-3 text-sm text-gpn-ink outline-none"
                rows={3}
                defaultValue="Проверка по видеоархиву выполнена."
              />
            </label>
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  )
}
