import { hierarchy, type HierarchyLevel } from '../../data/topology'
import { cn } from '../../lib/utils'
import { X } from 'lucide-react'

const levels: { key: HierarchyLevel; label: string }[] = [
  { key: 'subsidiary', label: 'Дочернее общество' },
  { key: 'field', label: 'Месторождение' },
  { key: 'area', label: 'Площадной объект' },
  { key: 'cluster', label: 'Куст' },
  { key: 'well', label: 'Скважина' },
]

export interface HierarchyState {
  subsidiary?: string
  field?: string
  area?: string
  cluster?: string
  well?: string
}

interface Props {
  value: HierarchyState
  onChange: (next: HierarchyState) => void
  light?: boolean
}

export function HierarchyFilters({ value, onChange, light }: Props) {
  const chips = levels
    .map((l) => {
      const id = value[l.key]
      const opt = hierarchy[l.key].find((o) => o.id === id)
      return opt ? { key: l.key, label: opt.label } : null
    })
    .filter(Boolean) as { key: HierarchyLevel; label: string }[]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <select
            key={l.key}
            value={value[l.key] ?? ''}
            onChange={(e) => {
              const next: HierarchyState = { ...value, [l.key]: e.target.value || undefined }
              const order: HierarchyLevel[] = ['subsidiary', 'field', 'area', 'cluster', 'well']
              const idx = order.indexOf(l.key)
              order.slice(idx + 1).forEach((k) => {
                delete next[k]
              })
              onChange(next)
            }}
            className={cn(
              'rounded-lg px-3 py-2 text-sm outline-none transition',
              light
                ? 'border border-gpn-navy/15 bg-white text-gpn-ink'
                : 'border border-white/15 bg-white/5 text-white',
            )}
          >
            <option value="">{l.label}</option>
            {hierarchy[l.key]
              .filter((o) => {
                if (l.key === 'subsidiary') return true
                const parents: Record<HierarchyLevel, HierarchyLevel | null> = {
                  subsidiary: null,
                  field: 'subsidiary',
                  area: 'field',
                  cluster: 'area',
                  well: 'cluster',
                }
                const p = parents[l.key]
                if (!p || !value[p]) return true
                return o.parentId === value[p]
              })
              .map((o) => (
                <option key={o.id} value={o.id} className="text-gpn-ink">
                  {o.label}
                </option>
              ))}
          </select>
        ))}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <span
              key={c.key}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs',
                light ? 'bg-gpn-blue/10 text-gpn-navy' : 'bg-gpn-sky/15 text-gpn-sky',
              )}
            >
              {c.label}
              <button
                type="button"
                onClick={() => {
                  const next = { ...value }
                  delete next[c.key]
                  onChange(next)
                }}
                className="opacity-70 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => onChange({})}
            className={cn(
              'ml-auto text-xs underline-offset-2 hover:underline',
              light ? 'text-gpn-blue' : 'text-white/60',
            )}
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  )
}
