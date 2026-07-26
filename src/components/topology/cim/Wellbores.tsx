import { useMemo } from 'react'
import * as THREE from 'three'

export function WellboresUnderground({
  origins,
  visible,
}: {
  origins: Array<[number, number, number]>
  visible: boolean
}) {
  const tubes = useMemo(() => {
    if (!visible) return []
    return origins.slice(0, 4).map((o, i) => {
      const pts: THREE.Vector3[] = []
      for (let t = 0; t <= 10; t++) {
        const k = t / 10
        pts.push(
          new THREE.Vector3(
            o[0] + Math.sin(i * 1.2 + k * 2) * k * 1.3,
            o[1] - k * 4.5,
            o[2] + Math.cos(i * 0.8 + k) * k * 0.9,
          ),
        )
      }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.04, 5, false)
    })
  }, [origins, visible])

  if (!visible) return null

  return (
    <group>
      {tubes.map((geom, i) => (
        <mesh key={i} geometry={geom}>
          <meshStandardMaterial
            color="#32ADE5"
            transparent
            opacity={0.55}
            metalness={0.25}
            roughness={0.35}
            emissive="#0a3a55"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      <mesh position={[origins[0]?.[0] ?? -30, -4.4, origins[0]?.[2] ?? 0]} rotation={[-0.12, 0.15, 0]}>
        <boxGeometry args={[12, 0.55, 9]} />
        <meshStandardMaterial color="#4A6B5C" transparent opacity={0.4} roughness={0.9} />
      </mesh>
    </group>
  )
}
