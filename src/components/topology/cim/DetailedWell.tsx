import { useMemo } from 'react'
import * as THREE from 'three'
import { mat, pipeMat } from './materials'
import { Foundation, HorizontalPipe } from './Primitives'

/** Lighter wellhead for large networks */
export function DetailedWellhead({
  position = [0, 0, 0] as [number, number, number],
  status = 95,
}: {
  position?: [number, number, number]
  status?: number
}) {
  return (
    <group position={position}>
      <Foundation w={1.1} d={1.1} h={0.1} />
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 0.4, 10]} />
        <meshBasicMaterial color="#5C636B" />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.35, 0.22, 0.3]} />
        <meshBasicMaterial color="#4A5560" />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.35, 8]} />
        <meshBasicMaterial color="#8B929A" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial
          color={status >= 95 ? '#2E8B57' : status >= 85 ? '#D4A017' : '#C0392B'}
        />
      </mesh>
      <HorizontalPipe length={0.9} radius={0.04} color={pipeMat.oil} position={[0.55, 0.75, 0]} />
    </group>
  )
}

export function WellClusterPad({ count = 2 }: { count?: number }) {
  const wells = Array.from({ length: count }, (_, i) => ({
    id: i,
    pos: [(i % 2) * 2.4 - 1.2, 0, Math.floor(i / 2) * 2.6 - 0.8] as [number, number, number],
  }))

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[5.5, 5]} />
        <meshBasicMaterial color="#9A9590" />
      </mesh>
      {wells.map((w) => (
        <DetailedWellhead key={w.id} position={w.pos} status={88 + w.id * 3} />
      ))}
      <mesh position={[0, 0.35, 2.2]}>
        <boxGeometry args={[4, 0.4, 0.4]} />
        <meshBasicMaterial color="#6B7280" />
      </mesh>
      <HorizontalPipe length={3.8} color={pipeMat.oil} radius={0.06} position={[0, 0.6, 2.2]} />
    </group>
  )
}

export function WellboresUnderground({
  origins,
  visible,
}: {
  origins: Array<[number, number, number]>
  visible: boolean
}) {
  const tubes = useMemo(() => {
    if (!visible) return []
    // only first 3 origins
    return origins.slice(0, 3).map((o, i) => {
      const pts: THREE.Vector3[] = []
      for (let t = 0; t <= 8; t++) {
        const k = t / 8
        pts.push(
          new THREE.Vector3(
            o[0] + Math.sin(i + k * 2) * k,
            o[1] - k * 4,
            o[2] + Math.cos(i + k) * k * 0.7,
          ),
        )
      }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.04, 4, false)
    })
  }, [origins, visible])

  if (!visible) return null

  return (
    <group>
      {tubes.map((geom, i) => (
        <mesh key={i} geometry={geom}>
          <meshBasicMaterial color="#32ADE5" transparent opacity={0.5} />
        </mesh>
      ))}
      <mesh position={[origins[0]?.[0] ?? -30, -4.2, origins[0]?.[2] ?? 0]}>
        <boxGeometry args={[10, 0.5, 8]} />
        <meshBasicMaterial color="#4A6B5C" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

void mat
