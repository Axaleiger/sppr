import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import type { NodeKind, SchemeNodeData } from '../../data/topology'
import { kindColors } from '../../data/topology3d'

function statusEmissive(status: number) {
  if (status >= 95) return '#22c55e'
  if (status >= 85) return '#f59e0b'
  return '#ef4444'
}

function WellHeads() {
  return (
    <group>
      {[-0.55, 0, 0.55].map((x, i) => (
        <group key={i} position={[x, 0.55, 0]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.9, 10]} />
            <meshStandardMaterial color="#006CB1" metalness={0.4} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[0.35, 0.1, 0.18]} />
            <meshStandardMaterial color="#32ADE5" metalness={0.35} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.15, 0.2]} castShadow>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#FF6A00" emissive="#FF6A00" emissiveIntensity={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function PlantTanks({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[-0.45, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 1.2, 24]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, 0.55, 0.15]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.9, 24]} />
        <meshStandardMaterial color="#004374" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0.15, 0.35, -0.4]} castShadow>
        <boxGeometry args={[0.9, 0.5, 0.45]} />
        <meshStandardMaterial color="#006CB1" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[-0.45, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.35, 8]} />
        <meshStandardMaterial color="#FF6A00" />
      </mesh>
    </group>
  )
}

function PowerPlant() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.4, 0.7, 0.9]} />
        <meshStandardMaterial color="#004374" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[-0.35, 1.0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.45]} />
        <meshStandardMaterial color="#006CB1" />
      </mesh>
      <mesh position={[0.4, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.1, 12]} />
        <meshStandardMaterial color="#8A96A8" metalness={0.5} roughness={0.25} />
      </mesh>
      <mesh position={[0.4, 1.85, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FF6A00" emissive="#FF6A00" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function PowerTower() {
  return (
    <group>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.12, 2.2, 6]} />
        <meshStandardMaterial color="#004374" metalness={0.5} roughness={0.3} />
      </mesh>
      {[0, 1].map((i) => (
        <mesh key={i} position={[0, 0.7 + i * 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 1.2, 6]} />
          <meshStandardMaterial color="#32ADE5" metalness={0.6} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#E8B923" emissive="#E8B923" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function Reservoir() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = -0.15 + Math.sin(clock.elapsedTime * 0.8) * 0.04
    }
  })
  return (
    <group>
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.2, 48]} />
        <meshStandardMaterial color="#003057" roughness={0.85} />
      </mesh>
      <mesh ref={ref} position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 48]} />
        <meshStandardMaterial
          color="#006CB1"
          transparent
          opacity={0.75}
          metalness={0.2}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.3, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <meshStandardMaterial color="#FF6A00" />
      </mesh>
      <mesh position={[0.35, 0.35, 0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
        <meshStandardMaterial color="#32ADE5" />
      </mesh>
    </group>
  )
}

function StorageDome() {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.85, 0.5, 24]} />
        <meshStandardMaterial color="#004374" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#32ADE5" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  )
}

function FacilityGeometry({ kind }: { kind: NodeKind }) {
  switch (kind) {
    case 'wells':
    case 'cluster':
      return <WellHeads />
    case 'gtes':
      return <PowerPlant />
    case 'vl':
    case 'ps':
      return <PowerTower />
    case 'plast':
      return <Reservoir />
    case 'phg':
      return <StorageDome />
    default:
      return <PlantTanks color={kindColors[kind] ?? '#006CB1'} />
  }
}

interface Props {
  id: string
  position: [number, number, number]
  data: SchemeNodeData
  selected: boolean
  dimmed: boolean
  whatIf: boolean
  onSelect: (id: string) => void
}

export function FacilityMesh({
  id,
  position,
  data,
  selected,
  dimmed,
  whatIf,
  onSelect,
}: Props) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const accent = whatIf ? '#FF6A00' : kindColors[data.kind]

  useFrame((_, dt) => {
    if (!group.current) return
    const target = selected || hovered ? 1.08 : 1
    const s = group.current.scale
    s.x += (target - s.x) * Math.min(1, dt * 8)
    s.y += (target - s.y) * Math.min(1, dt * 8)
    s.z += (target - s.z) * Math.min(1, dt * 8)
  })

  const platformColor = useMemo(() => (selected ? '#FFE8D6' : '#F4F7FA'), [selected])

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <RoundedBox args={[2.2, 0.12, 2.2]} radius={0.08} position={[0, 0.06, 0]} receiveShadow>
        <meshStandardMaterial
          color={platformColor}
          roughness={0.45}
          metalness={0.05}
          transparent
          opacity={dimmed ? 0.35 : 1}
        />
      </RoundedBox>

      {/* rim light ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
        <ringGeometry args={[1.0, 1.12, 48]} />
        <meshStandardMaterial
          color={selected || hovered ? accent : '#32ADE5'}
          emissive={selected || hovered ? accent : '#006CB1'}
          emissiveIntensity={selected || hovered ? 0.7 : 0.15}
          transparent
          opacity={dimmed ? 0.2 : 0.85}
        />
      </mesh>

      <group position={[0, 0.12, 0]} visible={!dimmed || selected}>
        <FacilityGeometry kind={data.kind} />
      </group>

      {/* status beacon */}
      <mesh position={[0.9, 0.35, -0.9]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color={statusEmissive(data.status)}
          emissive={statusEmissive(data.status)}
          emissiveIntensity={0.85}
        />
      </mesh>

      <Html
        position={[0, 2.35, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none', opacity: dimmed && !selected ? 0.25 : 1 }}
      >
        <div className="min-w-[110px] rounded-xl border border-white/20 bg-[#021526]/85 px-2.5 py-1.5 text-center shadow-lg backdrop-blur-md">
          <div className="font-display text-sm font-semibold tracking-wide text-white whitespace-nowrap">
            {data.label}
          </div>
          <div className="text-[11px] font-semibold">
            <span style={{ color: statusEmissive(data.status) }}>{data.status}%</span>
          </div>
        </div>
      </Html>
    </group>
  )
}
