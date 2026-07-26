import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import type { SchemeNodeData } from '../../data/topology'
import { MiniArea } from '../charts/Charts'
import { cn, statusTone } from '../../lib/utils'

type FacilityNodeType = Node<SchemeNodeData, 'facility'>

function Icon({ kind }: { kind: SchemeNodeData['kind'] }) {
  const common = 'w-full h-full'
  switch (kind) {
    case 'wells':
      return (
        <svg viewBox="0 0 80 64" className={common}>
          <rect x="10" y="40" width="60" height="8" rx="2" fill="#004374" opacity=".3" />
          <rect x="34" y="12" width="6" height="36" fill="#006CB1" />
          <rect x="28" y="8" width="18" height="6" rx="1" fill="#32ADE5" />
          <circle cx="24" cy="48" r="5" fill="#FF6A00" />
          <circle cx="56" cy="48" r="5" fill="#32ADE5" />
        </svg>
      )
    case 'gtes':
      return (
        <svg viewBox="0 0 80 64" className={common}>
          <rect x="14" y="28" width="52" height="24" rx="3" fill="#006CB1" />
          <rect x="20" y="18" width="16" height="12" fill="#32ADE5" />
          <rect x="44" y="14" width="10" height="16" fill="#004374" />
          <path d="M24 18c0-8 8-12 8-12" stroke="#FF6A00" strokeWidth="2" fill="none" />
        </svg>
      )
    case 'ukpg':
    case 'upn':
    case 'dns':
    case 'cppn':
      return (
        <svg viewBox="0 0 80 64" className={common}>
          <rect x="8" y="30" width="64" height="22" rx="3" fill="#006CB1" />
          <circle cx="28" cy="28" r="12" fill="#32ADE5" />
          <circle cx="52" cy="26" r="14" fill="#004374" />
          <rect x="58" y="18" width="8" height="34" fill="#FF6A00" opacity=".85" />
        </svg>
      )
    case 'vl':
    case 'ps':
      return (
        <svg viewBox="0 0 80 64" className={common}>
          <path d="M40 8 L52 56 H28 Z" fill="#004374" />
          <path d="M22 24 H58" stroke="#32ADE5" strokeWidth="3" />
          <path d="M18 36 H62" stroke="#006CB1" strokeWidth="3" />
          <circle cx="40" cy="12" r="3" fill="#FF6A00" />
        </svg>
      )
    case 'phg':
    case 'plast':
      return (
        <svg viewBox="0 0 80 64" className={common}>
          <path d="M8 40c12-10 20-10 32 0s20 10 32 0v16H8z" fill="#006CB1" />
          <path d="M8 48c12-8 20-8 32 0s20 8 32 0" stroke="#32ADE5" fill="none" />
          <path d="M30 20 v28 M50 16 v32" stroke="#FF6A00" strokeWidth="2" />
        </svg>
      )
    case 'arm':
      return (
        <svg viewBox="0 0 80 64" className={common}>
          <rect x="16" y="12" width="48" height="32" rx="4" fill="#004374" />
          <rect x="22" y="18" width="36" height="20" fill="#32ADE5" opacity=".5" />
          <rect x="28" y="48" width="24" height="4" fill="#006CB1" />
          <path d="M30 24h8M30 30h14" stroke="#fff" strokeWidth="2" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 80 64" className={common}>
          <rect x="12" y="20" width="56" height="28" rx="4" fill="#006CB1" />
          <rect x="20" y="14" width="16" height="10" fill="#32ADE5" />
          <rect x="44" y="10" width="12" height="14" fill="#004374" />
        </svg>
      )
  }
}

export function FacilityNode({ data, selected }: NodeProps<FacilityNodeType>) {
  return (
    <div
      className={cn(
        'w-[148px] rounded-2xl border bg-white/95 p-2 shadow-xl transition',
        selected
          ? 'border-energy ring-2 ring-energy/40'
          : 'border-white/80 hover:border-gpn-sky',
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-gpn-sky !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-gpn-blue !w-2 !h-2 !border-0" />
      <Handle type="target" position={Position.Top} id="t" className="!bg-gpn-sky !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} id="b" className="!bg-gpn-blue !w-2 !h-2 !border-0" />

      {data.sparkline && (
        <div className="mb-1 h-8 rounded-md bg-gpn-surface/80 px-1">
          <MiniArea data={data.sparkline} />
        </div>
      )}

      <div className="flex h-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#F4F7FA] to-[#DCEAF5]">
        <div className="h-14 w-16">
          <Icon kind={data.kind} />
        </div>
      </div>

      <div className="mt-2 px-1">
        <div className="font-display text-sm font-semibold tracking-wide text-gpn-navy">
          {data.label}
        </div>
        {data.subtitle && (
          <div className="truncate text-[10px] text-gpn-muted">{data.subtitle}</div>
        )}
        <div className={cn('mt-1 text-xs font-semibold', statusTone(data.status))}>
          {data.status}%
        </div>
      </div>
    </div>
  )
}
