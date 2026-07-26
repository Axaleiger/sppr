import { useMemo } from 'react'
import type { FlowKind } from '../../data/topology'
import { pipeMat } from './cim/materials'

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

/** Detailed pipes with sparse supports — balanced quality/perf */
export function FlowPipe({ start, end, kind, active, whatIf, index = 0 }: Props) {
  const color = whatIf && kind !== 'info' ? '#C0392B' : colors[kind]

  const { length, mid, yaw, supports } = useMemo(() => {
    const dx = end[0] - start[0]
    const dz = end[2] - start[2]
    const len = Math.sqrt(dx * dx + dz * dz) || 0.01
    const h = 1.45 + (index % 3) * 0.1
    const m: [number, number, number] = [(start[0] + end[0]) / 2, h, (start[2] + end[2]) / 2]
    const y = Math.atan2(dx, dz)
    const n = Math.max(2, Math.min(5, Math.floor(len / 7)))
    const sup: [number, number, number][] = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      sup.push([start[0] + dx * t, 0, start[2] + dz * t])
    }
    return { length: len, mid: m, yaw: y, supports: sup }
  }, [start, end, index])

  const opacity = active ? 1 : 0.15

  return (
    <group>
      {supports.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[-0.28, mid[1] / 2, 0]} castShadow>
            <boxGeometry args={[0.09, mid[1], 0.09]} />
            <meshStandardMaterial color="#5C636B" metalness={0.55} roughness={0.4} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.28, mid[1] / 2, 0]} castShadow>
            <boxGeometry args={[0.09, mid[1], 0.09]} />
            <meshStandardMaterial color="#5C636B" metalness={0.55} roughness={0.4} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, mid[1], 0]} castShadow>
            <boxGeometry args={[0.7, 0.08, 0.1]} />
            <meshStandardMaterial color="#6B7280" metalness={0.5} roughness={0.4} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}

      <group position={mid} rotation={[0, yaw, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[kind === 'info' ? 0.03 : 0.065, kind === 'info' ? 0.03 : 0.065, length, 8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.55}
            roughness={0.35}
            transparent
            opacity={opacity}
            emissive={color}
            emissiveIntensity={active ? 0.08 : 0}
          />
        </mesh>
        {kind !== 'info' && (
          <>
            <mesh position={[0.16, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, length, 6]} />
              <meshStandardMaterial
                color={kind === 'oil' ? pipeMat.water : pipeMat.gas}
                metalness={0.5}
                roughness={0.35}
                transparent
                opacity={opacity}
              />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.28, 0.035, length]} />
              <meshStandardMaterial color="#A0A7B0" metalness={0.4} roughness={0.45} transparent opacity={opacity} />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}
