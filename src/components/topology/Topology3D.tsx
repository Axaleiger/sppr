import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, Sky } from '@react-three/drei'
import { edges3d, nodes3d } from '../../data/topology3d'
import { FacilityMesh } from './FacilityMesh'
import { FlowPipe } from './FlowPipe'
import { ObjectDetailPanel } from './ObjectDetailPanel'
import { pipeMat } from './cim/materials'
import { GisTerrain } from './cim/GisTerrain'
import { WellboresUnderground } from './cim/DetailedWell'
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
    nodes3d.forEach((n) => {
      map.set(n.id, [n.position.x, n.position.y, n.position.z])
    })
    return map
  }, [])

  const wellOrigins = useMemo(() => {
    return nodes3d
      .filter((n) => n.data.kind === 'wells' || n.data.kind === 'plast')
      .map((n) => [n.position.x, n.position.y, n.position.z] as [number, number, number])
  }, [])

  const related = useMemo(() => {
    if (!selectedId) return null
    const set = new Set<string>()
    edges3d.forEach((e) => {
      if (e.source === selectedId || e.target === selectedId) {
        set.add(e.id)
        set.add(e.source)
        set.add(e.target)
      }
    })
    set.add(selectedId)
    return set
  }, [selectedId])

  return (
    <>
      <color attach="background" args={['#B8C4CE']} />
      <fog attach="fog" args={['#B8C4CE', 60, 110]} />
      <Sky
        distance={450000}
        sunPosition={[40, 18, 25]}
        inclination={0.49}
        azimuth={0.22}
        mieCoefficient={0.004}
        rayleigh={0.8}
      />
      <hemisphereLight args={['#EAF2FF', '#6B8F4E', 0.5]} />
      <ambientLight intensity={0.38} />
      <directionalLight
        castShadow
        position={[30, 35, 16]}
        intensity={1.65}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={120}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        color="#FFF6E8"
      />
      <directionalLight position={[-20, 12, -14]} intensity={0.3} color="#A8B8C8" />

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

      <ContactShadows
        position={[0, 0.03, 0]}
        opacity={0.35}
        scale={90}
        blur={2.4}
        far={22}
        color="#2A3035"
      />
      <Environment preset="warehouse" environmentIntensity={0.35} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.07}
        minDistance={6}
        maxDistance={85}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.2, 0]}
      />
    </>
  )
}

const legend: { kind: FlowKind; label: string; color: string }[] = [
  { kind: 'oil', label: 'Нефтепровод', color: pipeMat.oil },
  { kind: 'gas', label: 'Газопровод', color: pipeMat.gas },
  { kind: 'water', label: 'Водопровод', color: pipeMat.water },
  { kind: 'power', label: 'Кабельные трассы / ВЛ', color: pipeMat.power },
  { kind: 'info', label: 'Информационные потоки', color: pipeMat.info },
]

export function Topology3D({ whatIf }: { whatIf: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapMode, setMapMode] = useState<'imagery' | 'topo' | 'none'>('imagery')
  const [showGrass, setShowGrass] = useState(true)
  const [showWellbores, setShowWellbores] = useState(true)
  const selected = nodes3d.find((n) => n.id === selectedId)

  return (
    <div className="relative h-[calc(100vh-7.5rem)] w-full overflow-hidden rounded-none border border-white/10 bg-[#B8C4CE] md:rounded-2xl">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [32, 20, 34], fov: 36, near: 0.1, far: 300 }}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
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

      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-sm rounded border border-[#B0B5BB] bg-white/95 px-3 py-2 shadow-sm">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5C636B]">
          ЦИМ + ГИС · Digital Twin
        </div>
        <div className="mt-0.5 text-sm font-semibold text-[#1a2332]">
          3D обустройство промысла
        </div>
        <div className="mt-0.5 text-[11px] text-[#6B7280]">
          Подложка ESRI · {FIELD_ORIGIN.lat.toFixed(3)}°N, {FIELD_ORIGIN.lon.toFixed(3)}°E ·
          скважины LOD+ · стволы
        </div>
      </div>

      {/* Layer panel — VGIS / Esri style */}
      <div className="absolute right-4 top-4 z-10 w-52 rounded border border-[#B0B5BB] bg-white/95 p-3 shadow-sm">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#5C636B]">
          Слои карты
        </div>
        <div className="space-y-1.5">
          {(
            [
              ['imagery', 'Спутник (ESRI)'],
              ['topo', 'Топооснова'],
              ['none', 'Без подложки'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMapMode(id)}
              className={cn(
                'w-full rounded px-2 py-1.5 text-left text-[11px] transition',
                mapMode === id
                  ? 'bg-gpn-blue text-white'
                  : 'bg-[#F4F7FA] text-[#1a2332] hover:bg-[#E8ECF0]',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer items-center justify-between text-[11px] text-[#1a2332]">
          <span>Травяной покров</span>
          <input
            type="checkbox"
            checked={showGrass}
            onChange={(e) => setShowGrass(e.target.checked)}
            className="accent-gpn-blue"
          />
        </label>
        <label className="mt-2 flex cursor-pointer items-center justify-between text-[11px] text-[#1a2332]">
          <span>Стволы скважин (3D)</span>
          <input
            type="checkbox"
            checked={showWellbores}
            onChange={(e) => setShowWellbores(e.target.checked)}
            className="accent-gpn-blue"
          />
        </label>
      </div>

      <div className="absolute bottom-4 left-4 z-10 rounded border border-[#B0B5BB] bg-white/95 px-3 py-2 shadow-sm">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#5C636B]">
          Инженерные сети
        </div>
        <div className="flex flex-col gap-1">
          {legend.map((l) => (
            <div key={l.kind} className="flex items-center gap-2 text-[11px] text-[#1a2332]">
              <span className="h-1 w-7 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {whatIf && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded border border-[#C0392B]/40 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#C0392B] shadow-sm">
          Режим «Что если» — вариантные потоки
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
