import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { edges3d, nodes3d } from '../../data/topology3d'
import { FacilityMesh } from './FacilityMesh'
import { FlowPipe } from './FlowPipe'
import { ObjectDetailPanel } from './ObjectDetailPanel'
import { pipeMat } from './cim/materials'
import { GisTerrain } from './cim/GisTerrain'
import { WellboresUnderground } from './cim/Wellbores'
import { FIELD_ORIGIN } from './cim/gis'
import type { FlowKind } from '../../data/topology'
import { cn } from '../../lib/utils'

function Scene({
  whatIf,
  selectedId,
  onSelect,
  mapMode,
  showGrass,
  showWellbores,
}: {
  whatIf: boolean
  selectedId: string | null
  onSelect: (id: string | null) => void
  mapMode: 'imagery' | 'topo' | 'none'
  showGrass: boolean
  showWellbores: boolean
}) {
  const positions = useMemo(() => {
    const map = new Map<string, [number, number, number]>()
    nodes3d.forEach((n) => map.set(n.id, [n.position.x, n.position.y, n.position.z]))
    return map
  }, [])

  const wellOrigins = useMemo(
    () =>
      nodes3d
        .filter((n) => n.data.kind === 'wells')
        .map((n) => [n.position.x, n.position.y, n.position.z] as [number, number, number]),
    [],
  )

  const related = useMemo(() => {
    if (!selectedId) return null
    const set = new Set<string>([selectedId])
    edges3d.forEach((e) => {
      if (e.source === selectedId || e.target === selectedId) {
        set.add(e.id)
        set.add(e.source)
        set.add(e.target)
      }
    })
    return set
  }, [selectedId])

  return (
    <>
      <color attach="background" args={['#C9D2DB']} />
      <fog attach="fog" args={['#C9D2DB', 65, 120]} />
      <hemisphereLight args={['#F0F5FA', '#7A8F5C', 0.45]} />
      <ambientLight intensity={0.42} />
      <directionalLight
        castShadow
        position={[35, 42, 18]}
        intensity={1.35}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={100}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        color="#FFF5E8"
      />
      <directionalLight position={[-18, 12, -12]} intensity={0.28} color="#A8B8C8" />

      <GisTerrain mapMode={mapMode} showGrass={showGrass} />
      <WellboresUnderground origins={wellOrigins} visible={showWellbores} />

      {edges3d.map((e, i) => {
        const a = positions.get(e.source)
        const b = positions.get(e.target)
        if (!a || !b) return null
        return (
          <FlowPipe
            key={e.id}
            start={[a[0], 0, a[2]]}
            end={[b[0], 0, b[2]]}
            kind={e.kind}
            active={!related || related.has(e.id)}
            whatIf={whatIf}
            index={i % 3}
          />
        )
      })}

      {nodes3d.map((n) => (
        <FacilityMesh
          key={n.id}
          id={n.id}
          position={[n.position.x, n.position.y, n.position.z]}
          data={n.data}
          selected={selectedId === n.id}
          dimmed={!!related && !related.has(n.id)}
          onSelect={onSelect}
        />
      ))}

      <ContactShadows position={[0, 0.03, 0]} opacity={0.32} scale={90} blur={2.2} far={18} color="#2A3035" />
      <Environment preset="warehouse" environmentIntensity={0.32} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minDistance={8}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1, 0]}
      />
    </>
  )
}

const legend: { kind: FlowKind; label: string; color: string }[] = [
  { kind: 'oil', label: 'Нефтепровод', color: pipeMat.oil },
  { kind: 'gas', label: 'Газопровод', color: pipeMat.gas },
  { kind: 'water', label: 'Водопровод', color: pipeMat.water },
  { kind: 'power', label: 'Электросеть', color: pipeMat.power },
]

export function Topology3D({ whatIf }: { whatIf: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapMode, setMapMode] = useState<'imagery' | 'topo' | 'none'>('imagery')
  const [showGrass, setShowGrass] = useState(true)
  const [showWellbores, setShowWellbores] = useState(false)
  const selected = nodes3d.find((n) => n.id === selectedId)

  return (
    <div className="relative h-[calc(100vh-7.5rem)] w-full overflow-hidden rounded-none border border-white/10 bg-[#C9D2DB] md:rounded-2xl">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [42, 28, 48], fov: 38, near: 0.4, far: 250 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <Suspense fallback={null}>
          <Scene
            whatIf={whatIf}
            selectedId={selectedId}
            onSelect={setSelectedId}
            mapMode={mapMode}
            showGrass={showGrass}
            showWellbores={showWellbores}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-xs rounded border border-[#B0B5BB] bg-white/95 px-3 py-2 shadow-sm">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5C636B]">
          ЦПС · детализированная ЦИМ
        </div>
        <div className="mt-0.5 text-sm font-semibold text-[#1a2332]">
          {nodes3d.length} объектов · {edges3d.length} связей
        </div>
        <div className="mt-0.5 text-[11px] text-[#6B7280]">
          {FIELD_ORIGIN.lat.toFixed(2)}°N {FIELD_ORIGIN.lon.toFixed(2)}°E
        </div>
      </div>

      <div className="absolute right-4 top-4 z-10 w-48 rounded border border-[#B0B5BB] bg-white/95 p-3 shadow-sm">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#5C636B]">
          Слои
        </div>
        <div className="space-y-1">
          {(
            [
              ['imagery', 'Спутник'],
              ['topo', 'Топооснова'],
              ['none', 'Без подложки'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMapMode(id)}
              className={cn(
                'w-full rounded px-2 py-1 text-left text-[11px]',
                mapMode === id ? 'bg-gpn-blue text-white' : 'bg-[#F4F7FA] text-[#1a2332]',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="mt-2 flex items-center justify-between text-[11px] text-[#1a2332]">
          <span>Трава</span>
          <input type="checkbox" checked={showGrass} onChange={(e) => setShowGrass(e.target.checked)} />
        </label>
        <label className="mt-1 flex items-center justify-between text-[11px] text-[#1a2332]">
          <span>Стволы</span>
          <input
            type="checkbox"
            checked={showWellbores}
            onChange={(e) => setShowWellbores(e.target.checked)}
          />
        </label>
      </div>

      <div className="absolute bottom-4 left-4 z-10 rounded border border-[#B0B5BB] bg-white/95 px-3 py-2 shadow-sm">
        {legend.map((l) => (
          <div key={l.kind} className="flex items-center gap-2 text-[11px] text-[#1a2332]">
            <span className="h-1 w-6 rounded-sm" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {whatIf && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded border border-red-300 bg-white/95 px-3 py-1 text-[11px] font-semibold text-red-700">
          Что если
        </div>
      )}

      <ObjectDetailPanel
        nodeId={selectedId}
        label={selected?.data.label}
        whatIf={whatIf}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
