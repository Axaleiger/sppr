import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { FlowKind } from '../../data/topology'
import { pipeMat } from './cim/materials'
import { Column, IBeam, HorizontalPipe } from './cim/Primitives'

const colors: Record<FlowKind, string> = {
  oil: pipeMat.oil,
  gas: pipeMat.gas,
  water: pipeMat.water,
  power: pipeMat.power,
  info: pipeMat.info,
}

interface Props {
  start: [number, number, number]
  end: [number, number, number]
  kind: FlowKind
  active: boolean
  whatIf: boolean
  index?: number
}

/** Multi-pipe elevated rack corridor between facilities — CAD style */
export function FlowPipe({ start, end, kind, active, whatIf, index = 0 }: Props) {
  const color = whatIf && kind !== 'info' ? '#C0392B' : colors[kind]

  const { length, mid, yaw, supports } = useMemo(() => {
    const dx = end[0] - start[0]
    const dz = end[2] - start[2]
    const len = Math.sqrt(dx * dx + dz * dz) || 0.01
    const m: [number, number, number] = [
      (start[0] + end[0]) / 2,
      1.55 + index * 0.12,
      (start[2] + end[2]) / 2,
    ]
    const y = Math.atan2(dx, dz)
    const count = Math.max(2, Math.floor(len / 2.2))
    const sup: [number, number, number][] = []
    for (let i = 0; i <= count; i++) {
      const t = i / count
      sup.push([
        start[0] + dx * t,
        0,
        start[2] + dz * t,
      ])
    }
    return { length: len, mid: m, yaw: y, supports: sup }
  }, [start, end, index])

  const particle = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!particle.current || !active || kind === 'info') return
    const t = (clock.elapsedTime * 0.22 + index * 0.15) % 1
    particle.current.position.set(
      start[0] + (end[0] - start[0]) * t,
      mid[1] + 0.08,
      start[2] + (end[2] - start[2]) * t,
    )
  })

  const lateral = (index - 1) * 0.18

  return (
    <group>
      {supports.map((p, i) => (
        <group key={i} position={p}>
          <Column height={mid[1]} size={0.09} position={[-0.35, 0, 0]} />
          <Column height={mid[1]} size={0.09} position={[0.35, 0, 0]} />
          <IBeam length={0.85} position={[0, mid[1], 0]} />
        </group>
      ))}

      <group position={mid} rotation={[0, yaw, 0]}>
        <IBeam length={length} position={[0, 0, -0.35]} rotation={[0, Math.PI / 2, 0]} />
        <IBeam length={length} position={[0, 0, 0.35]} rotation={[0, Math.PI / 2, 0]} />

        <HorizontalPipe
          length={length + 0.3}
          radius={kind === 'info' ? 0.025 : 0.07}
          color={color}
          position={[lateral, 0.12, 0]}
          rotationY={Math.PI / 2}
        />

        {/* companion pipes for visual density */}
        {kind !== 'info' && (
          <>
            <HorizontalPipe
              length={length + 0.3}
              radius={0.045}
              color={kind === 'oil' ? pipeMat.water : pipeMat.oil}
              position={[lateral + 0.22, 0.1, 0]}
              rotationY={Math.PI / 2}
            />
            <HorizontalPipe
              length={length + 0.3}
              radius={0.035}
              color={pipeMat.air}
              position={[lateral - 0.22, 0.1, 0]}
              rotationY={Math.PI / 2}
            />
            {/* cable tray */}
            <mesh position={[0, 0.28, 0]} castShadow>
              <boxGeometry args={[0.35, 0.04, length]} />
              <meshStandardMaterial color="#A0A7B0" metalness={0.45} roughness={0.45} />
            </mesh>
          </>
        )}
      </group>

      {active && kind !== 'info' && (
        <mesh ref={particle}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
        </mesh>
      )}

      {/* dim inactive */}
      {!active && (
        <mesh position={mid} rotation={[0, yaw, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, length, 8]} />
          <meshStandardMaterial color={color} transparent opacity={0.12} />
        </mesh>
      )}
    </group>
  )
}
