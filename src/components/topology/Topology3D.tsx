import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from '@react-three/drei'
import { edges3d, nodes3d } from '../../data/topology3d'
import { FacilityMesh } from './FacilityMesh'
import { FlowPipe } from './FlowPipe'
import { ObjectDetailPanel } from './ObjectDetailPanel'
import { pipeMat } from './cim/materials'
import { mat } from './cim/materials'
import type { FlowKind } from '../../data/topology'

function SiteGround() {
  return (
    <group>
      {/* earth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#8A8578" roughness={1} metalness={0} />
      </mesh>
      {/* gravel yard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[70, 55]} />
        <meshStandardMaterial color={mat.gravel} roughness={0.95} metalness={0.05} />
      </mesh>
      {/* main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]} receiveShadow>
        <planeGeometry args={[55, 3.2]} />
        <meshStandardMaterial color={mat.asphalt} roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.01, 0]} receiveShadow>
        <planeGeometry args={[3.2, 40]} />
        <meshStandardMaterial color={mat.asphalt} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* road marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2]}>
        <planeGeometry args={[55, 0.08]} />
        <meshStandardMaterial color="#D4D8DE" />
      </mesh>
      {/* perimeter fence posts */}
      {Array.from({ length: 24 }, (_, i) => {
        const t = (i / 24) * Math.PI * 2
        const r = 32
        return (
          <mesh
            key={i}
            position={[Math.cos(t) * r, 0.6, Math.sin(t) * r * 0.75]}
            castShadow
          >
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshStandardMaterial color={mat.steelDark} metalness={0.5} roughness={0.4} />
          </mesh>
        )
      })}
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
      <color attach="background" args={['#D8DEE6']} />
      <fog attach="fog" args={['#D8DEE6', 55, 95]} />
      <hemisphereLight args={['#F2F5F8', '#8A8578', 0.55]} />
      <ambientLight intensity={0.42} />
      <directionalLight
        castShadow
        position={[22, 28, 12]}
        intensity={1.55}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={90}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        color="#FFF8F0"
      />
      <directionalLight position={[-15, 10, -10]} intensity={0.35} color="#B8C4D4" />

      <SiteGround />

      {edges3d.map((e, i) => {
        const a = positions.get(e.source)
        const b = positions.get(e.target)
        if (!a || !b) return null
        const start: [number, number, number] = [a[0], 0, a[2]]
        const end: [number, number, number] = [b[0], 0, b[2]]
        const active = !related || related.has(e.id)
        return (
          <FlowPipe
            key={e.id}
            start={start}
            end={end}
            kind={e.kind}
            active={active}
            whatIf={whatIf}
            index={i % 3}
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
            onSelect={onSelect}
          />
        )
      })}

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.4}
        scale={80}
        blur={2.2}
        far={20}
        color="#3A3F45"
      />
      <Environment preset="warehouse" environmentIntensity={0.45} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.07}
        minDistance={8}
        maxDistance={70}
        maxPolarAngle={Math.PI / 2.08}
        target={[0, 1, 0]}
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
  const selected = nodes3d.find((n) => n.id === selectedId)

  return (
    <div className="relative h-[calc(100vh-7.5rem)] w-full overflow-hidden rounded-none border border-white/10 bg-[#D8DEE6] md:rounded-2xl">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [28, 18, 28], fov: 38, near: 0.1, far: 250 }}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <Suspense fallback={null}>
          <Scene whatIf={whatIf} selectedId={selectedId} onSelect={setSelectedId} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded border border-[#B0B5BB] bg-white/95 px-3 py-2 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5C636B]">
          ЦИМ · 3D модель обустройства
        </div>
        <div className="mt-0.5 text-sm font-semibold text-[#1a2332]">
          Интерактивная схема промысла
        </div>
        <div className="mt-0.5 text-[11px] text-[#6B7280]">
          Вращение · масштаб · клик по объекту · LOD-детализация
        </div>
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
