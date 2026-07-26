import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { getObjectDetail } from '../../data/topology'
import { MiniArea } from '../charts/Charts'
import { cn, statusBg } from '../../lib/utils'

interface Props {
  nodeId: string | null
  label?: string
  whatIf?: boolean
  onClose: () => void
}

export function ObjectDetailPanel({ nodeId, label, whatIf, onClose }: Props) {
  const detail = nodeId ? getObjectDetail(nodeId) : null

  return (
    <AnimatePresence>
      {nodeId && detail && (
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="glass-strong absolute right-4 top-4 z-20 flex w-[320px] max-h-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl"
        >
          <div className="flex items-start justify-between border-b border-white/10 p-4">
            <div>
              <div className="font-display text-xl font-semibold text-white">
                {label ?? nodeId}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                <span className={cn('h-2 w-2 rounded-full', statusBg(detail.status))} />
                Загрузка / доступность {detail.status}%
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto p-4">
            <div className="h-20 rounded-xl bg-white/5 p-2">
              <MiniArea data={detail.trend} color={whatIf ? '#FF6A00' : '#32ADE5'} />
            </div>

            <div className="grid gap-2">
              {detail.metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                >
                  <span className="text-xs text-white/60">{m.label}</span>
                  <span className="font-display text-lg font-semibold text-white">
                    {m.value}
                    {m.unit && (
                      <span className="ml-1 text-xs font-sans font-normal text-white/45">
                        {m.unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {whatIf && detail.whatIf && (
              <div className="rounded-xl border border-energy/30 bg-energy/10 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-energy">
                  Сценарий «Что если»
                </div>
                <div className="space-y-2">
                  {detail.whatIf.map((w) => (
                    <div key={w.label} className="flex items-center justify-between text-sm">
                      <span className="text-white/70">{w.label}</span>
                      <span className="font-medium text-white">
                        {w.value}{' '}
                        <span className="text-energy text-xs">{w.delta}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="w-full rounded-xl bg-gpn-blue py-2.5 text-sm font-medium text-white transition hover:bg-gpn-sky"
            >
              Открыть цифровой двойник
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
