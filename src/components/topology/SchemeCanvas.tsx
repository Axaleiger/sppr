import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  flowColors,
  isoEdges,
  isoNodes,
  techEdges,
  techNodes,
  type FlowKind,
  type SchemeNodeData,
} from '../../data/topology'
import { FacilityNode } from './FacilityNode'
import { ObjectDetailPanel } from './ObjectDetailPanel'
import { cn } from '../../lib/utils'

const nodeTypes = { facility: FacilityNode }

type FacilityFlowNode = Node<SchemeNodeData, 'facility'>

function toFlowNodes(
  raw: Array<{ id: string; position: { x: number; y: number }; data: SchemeNodeData }>,
): FacilityFlowNode[] {
  return raw.map((n) => ({
    id: n.id,
    type: 'facility' as const,
    position: n.position,
    data: n.data,
  }))
}

function toFlowEdges(
  raw: Array<{ id: string; source: string; target: string; data: { kind: FlowKind } }>,
  whatIf: boolean,
  highlight: Set<string> | null,
): Edge[] {
  return raw.map((e, idx) => {
    const kind = e.data.kind
    const active = !highlight || highlight.has(e.id)
    const color = flowColors[kind]
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      animated: whatIf || kind === 'power' || kind === 'info',
      style: {
        stroke: color,
        strokeWidth: active ? (kind === 'info' ? 1.5 : 2.8) : 1,
        opacity: active ? 1 : 0.18,
        strokeDasharray: kind === 'info' ? '4 6' : undefined,
      },
      className: active && kind !== 'info' ? 'flow-dash' : undefined,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color,
        width: 16,
        height: 16,
      },
      data: { kind, order: idx },
    }
  })
}

const legend: { kind: FlowKind; label: string }[] = [
  { kind: 'oil', label: 'Нефть' },
  { kind: 'gas', label: 'Газ' },
  { kind: 'water', label: 'Вода' },
  { kind: 'power', label: 'Электричество' },
  { kind: 'info', label: 'Информационные потоки' },
]

function SchemeInner({
  mode,
  whatIf,
}: {
  mode: 'iso' | 'tech'
  whatIf: boolean
}) {
  const sourceNodes = mode === 'iso' ? isoNodes : techNodes
  const sourceEdges = mode === 'iso' ? isoEdges : techEdges

  const [nodes, setNodes, onNodesChange] = useNodesState<FacilityFlowNode>(
    toFlowNodes(sourceNodes as Array<{ id: string; position: { x: number; y: number }; data: SchemeNodeData }>),
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    toFlowEdges(sourceEdges, whatIf, null),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [highlight, setHighlight] = useState<Set<string> | null>(null)

  useEffect(() => {
    setNodes(
      toFlowNodes(
        sourceNodes as Array<{
          id: string
          position: { x: number; y: number }
          data: SchemeNodeData
        }>,
      ),
    )
    setEdges(toFlowEdges(sourceEdges, whatIf, null))
    setSelectedId(null)
    setHighlight(null)
  }, [mode, whatIf, sourceNodes, sourceEdges, setNodes, setEdges])

  useEffect(() => {
    setEdges(toFlowEdges(sourceEdges, whatIf, highlight))
  }, [highlight, whatIf, sourceEdges, setEdges])

  const selectedLabel = useMemo(() => {
    const n = nodes.find((x) => x.id === selectedId)
    return n?.data.label
  }, [nodes, selectedId])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedId(node.id)
      const related = new Set(
        sourceEdges
          .filter((e) => e.source === node.id || e.target === node.id)
          .map((e) => e.id),
      )
      setHighlight(related)
    },
    [sourceEdges],
  )

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (selectedId) return
      const related = new Set(
        sourceEdges
          .filter((e) => e.source === node.id || e.target === node.id)
          .map((e) => e.id),
      )
      setHighlight(related)
    },
    [selectedId, sourceEdges],
  )

  const onNodeMouseLeave = useCallback(() => {
    if (!selectedId) setHighlight(null)
  }, [selectedId])

  return (
    <div className="relative h-[calc(100vh-7.5rem)] w-full overflow-hidden rounded-none md:rounded-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onPaneClick={() => {
          setSelectedId(null)
          setHighlight(null)
        }}
        fitView
        minZoom={0.35}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
      >
        <Background gap={28} size={1} color="rgba(50,173,229,0.12)" />
        <Controls
          className="!overflow-hidden !rounded-xl !border-white/15 !bg-[#021526]/80 !shadow-xl"
          showInteractive={false}
        />
        <MiniMap
          className="!overflow-hidden !rounded-xl !border-white/15 !bg-[#021526]/80"
          nodeColor="#006CB1"
          maskColor="rgba(2,21,38,0.7)"
        />
      </ReactFlow>

      <div className="glass absolute bottom-4 left-4 z-10 rounded-2xl px-4 py-3">
        <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/50">
          Легенда потоков
        </div>
        <div className="flex flex-col gap-1.5">
          {legend.map((l) => (
            <div key={l.kind} className="flex items-center gap-2 text-xs text-white/80">
              <span
                className="h-0.5 w-8 rounded-full"
                style={{ background: flowColors[l.kind] }}
              />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {mode === 'iso' && (
        <div className="glass absolute right-4 bottom-4 z-10 hidden w-56 overflow-hidden rounded-2xl lg:block">
          <div className="bg-gradient-to-br from-gpn-navy to-gpn-deep p-3">
            <div className="text-[10px] uppercase tracking-wider text-gpn-sky">
              3D Digital Twin
            </div>
            <div className="mt-2 relative h-24 overflow-hidden rounded-lg bg-[linear-gradient(135deg,#004374,#006CB1_40%,#32ADE5)] opacity-90">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.25),transparent_45%)]" />
              <div className="absolute bottom-2 left-2 right-2 h-8 rounded bg-black/20 backdrop-blur-sm" />
              <div className="absolute left-4 top-4 h-10 w-8 rounded-sm bg-white/20" />
              <div className="absolute left-14 top-6 h-8 w-12 rounded-sm bg-white/15" />
            </div>
          </div>
        </div>
      )}

      <ObjectDetailPanel
        nodeId={selectedId}
        label={selectedLabel}
        whatIf={whatIf}
        onClose={() => {
          setSelectedId(null)
          setHighlight(null)
        }}
      />
    </div>
  )
}

export function SchemeCanvas({
  mode,
  whatIf,
}: {
  mode: 'iso' | 'tech'
  whatIf: boolean
}) {
  return (
    <ReactFlowProvider>
      <SchemeInner mode={mode} whatIf={whatIf} />
    </ReactFlowProvider>
  )
}

export function SchemeToolbar({
  mode,
  setMode,
  whatIf,
  setWhatIf,
}: {
  mode: 'iso' | 'tech'
  setMode: (m: 'iso' | 'tech') => void
  whatIf: boolean
  setWhatIf: (v: boolean) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-6">
      <div className="glass flex rounded-xl p-1">
        {(
          [
            ['iso', 'Изометрическая схема'],
            ['tech', 'Технологическая схема'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm transition',
              mode === id ? 'bg-gpn-blue text-white' : 'text-white/65 hover:text-white',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="glass ml-auto flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm">
        <span className={cn(whatIf ? 'text-energy' : 'text-white/70')}>Что если</span>
        <button
          type="button"
          role="switch"
          aria-checked={whatIf}
          onClick={() => setWhatIf(!whatIf)}
          className={cn(
            'relative h-6 w-11 rounded-full transition',
            whatIf ? 'bg-energy' : 'bg-white/20',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white transition',
              whatIf ? 'left-[22px]' : 'left-0.5',
            )}
          />
        </button>
      </label>

      <select className="glass rounded-xl px-3 py-2 text-sm text-white outline-none">
        <option className="text-gpn-ink">Оренбург</option>
        <option className="text-gpn-ink">Ямал</option>
        <option className="text-gpn-ink">Хантос</option>
      </select>
      <div className="glass rounded-xl px-3 py-2 text-sm text-white/80">07.2026</div>
    </div>
  )
}
