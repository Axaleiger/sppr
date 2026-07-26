import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { productionWidgets, series } from '../data/assistant'
import { AreaPanel, BarPanel, DonutPanel, LinePanel } from '../components/charts/Charts'

function WidgetBody({ id }: { id: string }) {
  const data = series(id.length * 3, 16, 35 + id.length, 16)
  switch (id) {
    case 'bp':
      return (
        <div className="space-y-2">
          <div className="overflow-hidden rounded-lg border border-black/5 text-[10px]">
            <div className="grid grid-cols-4 bg-gpn-surface px-2 py-1 font-medium text-gpn-muted">
              <span>Объект</span>
              <span>План</span>
              <span>Факт</span>
              <span>%</span>
            </div>
            {['Куст 12', 'Куст 15', 'ЦПС', 'УКПГ'].map((r, i) => (
              <div key={r} className="grid grid-cols-4 px-2 py-1 text-gpn-ink/80">
                <span>{r}</span>
                <span>{100 + i * 12}</span>
                <span>{96 + i * 11}</span>
                <span className="text-status-ok">{94 + i}%</span>
              </div>
            ))}
          </div>
          <div className="grid h-24 grid-cols-3 gap-1">
            <LinePanel data={data} keys={['a']} />
            <BarPanel data={data.map((d) => ({ name: `${d.x}`, a: d.a }))} keys={['a']} />
            <AreaPanel data={data} />
          </div>
        </div>
      )
    case 'disp':
      return (
        <div className="flex h-full gap-2 rounded-xl bg-gpn-deep p-2 text-white">
          <div className="flex-1 space-y-1 text-[10px]">
            {['Режим ОКН стабилен', 'Алерт: давление УПСВ', 'Смена вахты 18:00'].map((t) => (
              <div key={t} className="rounded bg-white/5 px-2 py-1.5">
                {t}
              </div>
            ))}
          </div>
          <div className="w-20">
            <DonutPanel
              data={[
                { name: 'ok', value: 78, color: '#22C55E' },
                { name: 'w', value: 22, color: '#FF6A00' },
              ]}
              center="78"
            />
          </div>
        </div>
      )
    case 'video':
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gpn-navy to-gpn-deep"
            >
              <div className="absolute left-2 top-2 h-8 w-10 rounded border-2 border-status-ok/80" />
              <div className="absolute right-3 top-6 h-10 w-8 rounded border-2 border-status-crit/80" />
              <div className="absolute bottom-2 left-2 text-[9px] text-white/70">CAM {i + 1}</div>
            </div>
          ))}
        </div>
      )
    case 'kpi':
      return (
        <div className="grid h-full grid-cols-6 grid-rows-4 gap-1">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="rounded"
              style={{
                background: ['#22C55E', '#F59E0B', '#32ADE5', '#006CB1'][i % 4],
                opacity: 0.55 + (i % 5) * 0.08,
              }}
            />
          ))}
        </div>
      )
    case 'fund':
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            {['В работе', 'Останов', 'Освоение'].map((t, i) => (
              <div key={t} className="flex-1 rounded-lg bg-gpn-surface p-2 text-center">
                <div className="font-display text-lg text-gpn-navy">{[128, 14, 9][i]}</div>
                <div className="text-[10px] text-gpn-muted">{t}</div>
              </div>
            ))}
          </div>
          <div className="flex h-6 overflow-hidden rounded-full">
            <div className="w-[70%] bg-status-ok" />
            <div className="w-[18%] bg-status-warn" />
            <div className="w-[12%] bg-gpn-sky" />
          </div>
        </div>
      )
    default:
      return <LinePanel data={data} keys={['a', 'b']} colors={['#006CB1', '#FF6A00']} />
  }
}

export function AssistantLevel2() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm text-white/50">
        <Link to="/assistant" className="hover:text-gpn-sky">
          Уровень 1
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white">Добыча</span>
      </div>

      <h1 className="font-display text-3xl font-bold text-white">Уровень 2: Добыча</h1>
      <p className="mt-1 mb-5 text-sm text-white/55">
        Операционный контур добычи и смежных процессов цифрового двойника.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productionWidgets.map((w, i) => {
          const body = (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-light card-lift flex h-[240px] flex-col rounded-2xl p-4"
            >
              <div className="mb-2 font-display text-lg font-semibold text-gpn-navy">
                {w.title}
              </div>
              <div className="min-h-0 flex-1">
                <WidgetBody id={w.id} />
              </div>
            </motion.div>
          )
          return w.link ? (
            <Link key={w.id} to={w.link}>
              {body}
            </Link>
          ) : (
            <div key={w.id}>{body}</div>
          )
        })}
      </div>
    </div>
  )
}
