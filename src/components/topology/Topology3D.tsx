import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
  Sky,
} from '@react-three/drei'
import { edges3d, nodes3d } from '../../data/topology3d'
import { FacilityMesh } from './FacilityMesh'
import { FlowPipe } from './FlowPipe'
import { ObjectDetailPanel } from './ObjectDetailPanel'
import { flowColors, type FlowKind } from '../../data/topology'

function Terrain() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a1f33" roughness={0.95} metalness={0.05} />
      </mesh>
      <Grid
        position={[0, 0.01, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#0d3a5c"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#1a6fa3"
        fadeDistance={42}
        fadeStrength={1.2}
        infiniteGrid
      />
    </group>
  )
}

function Scene({
  whatIf,
  selectedId,
  onSelect,
}: {
  whatIf: boolean
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const positions = useMemo(() => {
    const map = new Map<string, [number, number, number]>()
    nodes3d.forEach((n) => {
      map.set(n.id, [n.position.x, n.position.y, n.position.z])
    })
    return map
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
      <color attach="background" args={['#021526']} />
      <fog attach="fog" args={['#021526', 28, 55]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow
        position={[12, 18, 8]}
        intensity={1.35}
        shadow-mapSize={[2048, 2048]}
        color="#e8f4ff"
      />
      <pointLight position={[-10, 8, -6]} intensity={0.55} color="#32ADE5" />
      <pointLight
        position={[10, 6, 8]}
        intensity={whatIf ? 0.9 : 0.35}
        color={whatIf ? '#FF6A00' : '#006CB1'}
      />

      <Terrain />

      {edges3d.map((e) => {
        const a = positions.get(e.source)
        const b = positions.get(e.target)
        if (!a || !b) return null
        const start: [number, number, number] = [a[0], a[1] + 0.5, a[2]]
        const end: [number, number, number] = [b[0], b[1] + 0.5, b[2]]
        const active = !related || related.has(e.id)
        return (
          <FlowPipe
            key={e.id}
            start={start}
            end={end}
            kind={e.kind}
            active={active}
            whatIf={whatIf}
          />
        )
      })}

      {nodes3d.map((n) => {
        const dimmed = !!related && !related.has(n.id)
        return (
          <FacilityMesh
            key={n.id}
            id={n.id}
            position={[n.position.x, n.position.y, n.position.z]}
            data={n.data}
            selected={selectedId === n.id}
            dimmed={dimmed}
            whatIf={whatIf}
            onSelect={(id) => onSelect(id)}
          />
        )
      })}

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.45}
        scale={40}
        blur={2.5}
        far={12}
      />
      <Environment preset="city" />
      <Sky
        distance={450000}
        sunPosition={[8, 2, -6]}
        inclination={0.48}
        azimuth={0.25}
        mieCoefficient={0.005}
        rayleigh={0.6}
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={6}
        maxDistance={36}
        maxPolarAngle={Math.PI / 2.15}
        target={[1, 0.5, 0]}
      />
    </>
  )
}

const legend: { kind: FlowKind; label: string }[] = [
  { kind: 'oil', label: 'Нефть' },
  { kind: 'gas', label: 'Газ' },
  { kind: 'water', label: 'Вода' },
  { kind: 'power', label: 'Электричество' },
  { kind: 'info', label: 'Информационные потоки' },
]

export function Topology3D({ whatIf }: { whatIf: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = nodes3d.find((n) => n.id === selectedId)

  return (
    <div className="relative h-[calc(100vh-7.5rem)] w-full overflow-hidden rounded-none md:rounded-2xl border border-white/10">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [14, 11, 14], fov: 42, near: 0.1, far: 200 }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <Suspense fallback={null}>
          <Scene
            whatIf={whatIf}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 z-10 glass rounded-2xl px-4 py-3">
        <div className="font-display text-lg font-semibold text-white">
          3D топология промысла
        </div>
        <div className="mt-0.5 text-xs text-white/55">
          Вращение · колесо — масштаб · клик по объекту
        </div>
      </div>

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

      {whatIf && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-energy/40 bg-energy/20 px-4 py-1.5 text-xs font-semibold text-energy backdrop-blur-md">
          Режим «Что если» — альтернативные потоки
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
