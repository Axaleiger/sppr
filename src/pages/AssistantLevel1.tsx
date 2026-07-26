import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { level1Domains, series } from '../data/assistant'
import {
  AreaPanel,
  BarPanel,
  DonutPanel,
  HBarPanel,
  LinePanel,
} from '../components/charts/Charts'

function ChartPreview({ type }: { type: string }) {
  const data = series(type.length, 14, 45, 18)
  switch (type) {
    case 'production':
      return (
        <div className="grid h-full grid-rows-[1fr_1fr_0.8fr] gap-2">
          <div className="grid grid-cols-2 gap-2">
            <LinePanel data={data} keys={['a']} colors={['#32ADE5']} />
            <AreaPanel data={data} />
          </div>
          <HBarPanel
            data={[
              { name: 'Фонд', value: 82 },
              { name: 'Бурение', value: 64 },
              { name: 'ГТМ', value: 71 },
            ]}
          />
        </div>
      )
    case 'energy':
      return <AreaPanel data={data} colors={['#22C55E', '#32ADE5']} />
    case 'capex':
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          <div className="rounded-lg bg-gpn-navy/10 p-2 text-[10px] text-gpn-muted space-y-1">
            {['Объект А', 'Объект Б', 'Объект В', 'Объект Г'].map((r) => (
              <div key={r} className="flex justify-between border-b border-black/5 pb-1">
                <span>{r}</span>
                <span className="text-gpn-blue">в срок</span>
              </div>
            ))}
          </div>
          <div className="relative rounded-lg bg-[radial-gradient(circle_at_40%_40%,#32ADE5_0%,#004374_70%)] opacity-90">
            {[30, 55, 70].map((t) => (
              <span
                key={t}
                className="absolute h-2 w-2 rounded-full bg-energy"
                style={{ left: `${t}%`, top: `${100 - t}%` }}
              />
            ))}
          </div>
        </div>
      )
    case 'hr':
      return (
        <BarPanel
          data={[
            { name: 'ЦУД', a: 42, b: 28 },
            { name: 'Промысел', a: 65, b: 40 },
            { name: 'Бурение', a: 38, b: 22 },
          ]}
          keys={['a', 'b']}
        />
      )
    case 'hse':
      return (
        <DonutPanel
          data={[
            { name: 'A', value: 40, color: '#32ADE5' },
            { name: 'B', value: 30, color: '#006CB1' },
            { name: 'C', value: 20, color: '#FF6A00' },
            { name: 'D', value: 10, color: '#004374' },
          ]}
          center="100%"
        />
      )
    default:
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          <DonutPanel
            data={[
              { name: 'A', value: 28, color: '#32ADE5' },
              { name: 'B', value: 22, color: '#006CB1' },
              { name: 'C', value: 18, color: '#FF6A00' },
              { name: 'D', value: 32, color: '#8A96A8' },
            ]}
          />
          <BarPanel
            data={Array.from({ length: 8 }, (_, i) => ({
              name: `${i + 1}`,
              a: 20 + i * 3,
              b: 10 + i * 2,
            }))}
            stacked
          />
        </div>
      )
  }
}

export function AssistantLevel1() {
  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
            Визуальный ассистент
          </h1>
          <p className="mt-1 max-w-xl text-sm text-white/55">
            Сводка цифрового двойника промысла. Выберите домен для углубления.
          </p>
        </div>
      </div>

      <div className="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {level1Domains.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className={
              d.span.includes('col-span-2')
                ? 'md:col-span-2'
                : d.span.includes('row-span-2')
                  ? ''
                  : ''
            }
            style={
              d.id === 'prod'
                ? { gridRow: 'span 2' }
                : d.id === 'econ'
                  ? undefined
                  : undefined
            }
          >
            <Link
              to={d.path}
              className={`glass-light card-lift block h-full overflow-hidden rounded-2xl p-4 ${
                d.id === 'prod' ? 'min-h-[460px]' : 'min-h-[220px]'
              }`}
            >
              <span className="inline-flex rounded-full bg-energy px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {d.badge}
              </span>
              <div className="mt-2 font-display text-xl font-semibold text-gpn-navy">
                {d.title}
              </div>
              <div className={`mt-3 ${d.id === 'prod' ? 'h-[360px]' : 'h-[140px]'}`}>
                <ChartPreview type={d.charts} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
