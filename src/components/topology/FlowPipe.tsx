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

/** Lightweight corridor — single pipe + sparse supports (perf-first) */
export function FlowPipe({ start, end, kind, active, whatIf, index = 0 }: Props) {
  const color = whatIf && kind !== 'info' ? '#C0392B' : colors[kind]

  const { length, mid, yaw, supports } = useMemo(() => {
    const dx = end[0] - start[0]
    const dz = end[2] - start[2]
    const len = Math.sqrt(dx * dx + dz * dz) || 0.01
    const h = 1.35 + (index % 3) * 0.08
    const m: [number, number, number] = [(start[0] + end[0]) / 2, h, (start[2] + end[2]) / 2]
    const y = Math.atan2(dx, dz)
    const n = Math.max(2, Math.min(4, Math.floor(len / 8)))
    const sup: [number, number, number][] = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      sup.push([start[0] + dx * t, 0, start[2] + dz * t])
    }
    return { length: len, mid: m, yaw: y, supports: sup }
  }, [start, end, index])

  if (!active) {
    return (
      <mesh position={mid} rotation={[0, yaw, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, length, 5]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    )
  }

  return (
    <group>
      {supports.map((p, i) => (
        <mesh key={i} position={[p[0], mid[1] / 2, p[2]]}>
          <boxGeometry args={[0.1, mid[1], 0.1]} />
          <meshBasicMaterial color="#5C636B" />
        </mesh>
      ))}
      <mesh position={mid} rotation={[0, yaw, Math.PI / 2]}>
        <cylinderGeometry args={[kind === 'info' ? 0.03 : 0.07, kind === 'info' ? 0.03 : 0.07, length, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* second thinner line for visual density without heavy meshes */}
      {kind !== 'info' && (
        <mesh
          position={[mid[0], mid[1] + 0.12, mid[2]]}
          rotation={[0, yaw, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.04, 0.04, length, 5]} />
          <meshBasicMaterial color={kind === 'oil' ? pipeMat.water : pipeMat.gas} />
        </mesh>
      )}
    </group>
  )
}
