import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { QuadraticBezierLine } from '@react-three/drei'
import type { Mesh } from 'three'
import * as THREE from 'three'
import { flowColors, type FlowKind } from '../../data/topology'

interface Props {
  start: [number, number, number]
  end: [number, number, number]
  kind: FlowKind
  active: boolean
  whatIf: boolean
}

export function FlowPipe({ start, end, kind, active, whatIf }: Props) {
  const color = whatIf && kind !== 'info' ? '#FF6A00' : flowColors[kind]
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    Math.max(start[1], end[1]) + 1.2 + Math.abs(start[0] - end[0]) * 0.08,
    (start[2] + end[2]) / 2,
  ]

  const particle = useRef<Mesh>(null)
  const curve = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...start),
        new THREE.Vector3(...mid),
        new THREE.Vector3(...end),
      ),
    [start, end, mid],
  )

  useFrame(({ clock }) => {
    if (!particle.current || !active) return
    const t = (clock.elapsedTime * (whatIf ? 0.45 : 0.28) + kind.length * 0.1) % 1
    const p = curve.getPoint(t)
    particle.current.position.copy(p)
  })

  const tube = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, kind === 'info' ? 0.03 : 0.055, 8, false)
  }, [curve, kind])

  return (
    <group>
      <mesh geometry={tube}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={active ? (kind === 'info' ? 0.45 : 0.85) : 0.12}
          emissive={color}
          emissiveIntensity={active ? (whatIf ? 0.55 : 0.25) : 0.05}
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>

      <QuadraticBezierLine
        start={start}
        end={end}
        mid={mid}
        color={color}
        lineWidth={active ? 2 : 0.5}
        dashed={kind === 'info'}
        dashScale={8}
        transparent
        opacity={active ? 0.9 : 0.15}
      />

      {active && (
        <mesh ref={particle}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={color}
            emissiveIntensity={1.2}
          />
        </mesh>
      )}
    </group>
  )
}
