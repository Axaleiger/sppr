import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  matrixCells,
  modelHierarchy,
  processCols,
  processRows,
  scenarios,
  workflowSteps,
} from '../data/orchestrator'
import { cn } from '../lib/utils'
import { CloudDownload, FileText, Settings2, Smartphone, Code2 } from 'lucide-react'

export function OrchestratorPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [scenarioId, setScenarioId] = useState('30')
  const scenario = scenarios.find((s) => s.id === scenarioId)!

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Оркестратор</h1>
      <p className="mt-1 mb-5 max-w-2xl text-sm text-white/55">
        Управление сценариями цифрового двойника: от подготовки данных до мониторинга.
      </p>

      <div className="mb-6 flex flex-wrap gap-1">
        {workflowSteps.map((step, i) => (
          <button
            key={step}
            type="button"
            onClick={() => setActiveStep(i)}
            className={cn(
              'relative rounded-lg px-3 py-2 text-xs font-medium transition md:text-sm',
              i === activeStep
                ? 'bg-energy text-white shadow-lg shadow-energy/30'
                : 'glass text-white/70 hover:text-white',
            )}
          >
            {step}
            {i < workflowSteps.length - 1 && (
              <span className="pointer-events-none absolute -right-1 top-1/2 hidden h-2 w-2 -translate-y-1/2 rotate-45 bg-inherit md:block" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_1fr_260px]">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.14em] text-white/45">
            Сценарии на вход
          </div>
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScenarioId(s.id)}
              className={cn(
                'w-full rounded-2xl border p-4 text-left transition',
                scenarioId === s.id
                  ? 'border-transparent shadow-lg'
                  : 'glass border-white/10 hover:border-white/25',
              )}
              style={
                scenarioId === s.id
                  ? {
                      background: `linear-gradient(135deg, ${s.color}33, rgba(2,21,38,0.85))`,
                      boxShadow: `0 12px 40px ${s.color}33`,
                      borderColor: `${s.color}66`,
                    }
                  : undefined
              }
            >
              <div className="font-display text-2xl font-bold" style={{ color: s.color }}>
                {s.days} {s.days === 1 ? 'день' : 'дней'}
              </div>
              <div className="mt-1 text-sm text-white/75">{s.goal}</div>
            </button>
          ))}
        </div>

        <div className="glass relative overflow-hidden rounded-3xl p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,108,177,0.25),transparent_55%)]" />
          <div className="relative flex flex-col items-center">
            <motion.div
              key={scenarioId}
              initial={{ scale: 0.92, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative flex h-44 w-44 items-center justify-center rounded-full border border-gpn-sky/40 bg-gpn-navy/40 shadow-[0_0_60px_rgba(50,173,229,0.25)]"
            >
              <div className="absolute inset-3 rounded-full border border-dashed border-white/20 animate-[spin_18s_linear_infinite]" />
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-white">Оркестратор</div>
                <div className="text-[10px] uppercase tracking-wider text-gpn-sky">СППР core</div>
              </div>
              <Code2 className="absolute -top-1 left-8 h-5 w-5 text-gpn-sky" />
              <Settings2 className="absolute top-6 -right-1 h-5 w-5 text-energy" />
              <FileText className="absolute bottom-6 -left-1 h-5 w-5 text-white/70" />
              <CloudDownload className="absolute -bottom-1 right-10 h-5 w-5 text-gpn-sky" />
              <Smartphone className="absolute top-1/2 -right-3 h-5 w-5 text-white/70" />
            </motion.div>

            <div className="mt-8 w-full">
              <div className="mb-3 text-xs uppercase tracking-[0.14em] text-white/45">
                Иерархия моделей
              </div>
              <div className="flex flex-col gap-2">
                {modelHierarchy.map((m, i) => (
                  <motion.div
                    key={m.layer}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2"
                  >
                    <div className="min-w-[140px] rounded-lg bg-gpn-blue/80 px-3 py-1.5 text-center font-display text-sm font-semibold">
                      {m.layer}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.models.map((model) => (
                        <span
                          key={model}
                          className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/75"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.14em] text-white/45">
            Вывод результата · {scenario.days}д
          </div>
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4"
            style={{ borderColor: `${scenario.color}55` }}
          >
            <ul className="space-y-2">
              {scenario.outputs.map((o) => (
                <li
                  key={o}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/85"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: scenario.color }}
                  />
                  {o}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="glass mt-6 overflow-x-auto rounded-2xl p-4">
        <div className="mb-3 text-xs uppercase tracking-[0.14em] text-white/45">
          Матрица процессов × доменов
        </div>
        <table className="w-full min-w-[900px] border-separate border-spacing-2 text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs text-white/40 font-normal" />
              {processCols.map((c) => (
                <th key={c} className="px-2 py-1 text-xs font-medium text-gpn-sky">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processRows.map((row, ri) => (
              <tr key={row}>
                <td className="whitespace-nowrap pr-2 text-xs text-white/55">{row}</td>
                {processCols.map((_, ci) => {
                  const key = `${ri}-${ci}`
                  return (
                    <td key={key}>
                      <button
                        type="button"
                        className="w-full rounded-xl bg-gpn-blue/25 px-2 py-2 text-center text-xs text-white/90 transition hover:bg-gpn-sky/30"
                      >
                        {matrixCells[key]}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 rounded-xl bg-gpn-sky/15 px-4 py-2 text-center text-xs text-gpn-sky">
          Данные — единый фундамент всех контуров СППР
        </div>
      </div>
    </div>
  )
}
