import { useMemo } from 'react'
import * as THREE from 'three'
import { mat, pipeMat, steelProps } from './materials'
import { Foundation, Handrail, HorizontalPipe } from './Primitives'

/** High-detail Christmas tree / wellhead */
export function DetailedWellhead({
  position = [0, 0, 0] as [number, number, number],
  label,
  status = 95,
  withPumpjack = false,
}: {
  position?: [number, number, number]
  label?: string
  status?: number
  withPumpjack?: boolean
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.75, 0.8, 0.1, 24]} />
        <meshStandardMaterial color={mat.concreteDark} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.95, 32]} />
        <meshStandardMaterial color={mat.gravel} roughness={0.95} />
      </mesh>

      <Foundation w={1.6} d={1.6} h={0.12} />

      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.28, 20]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.3, 0.18, 20]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>

      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.32, 16]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>

      <mesh position={[0, 1.02, 0]} castShadow>
        <boxGeometry args={[0.42, 0.28, 0.36]} />
        <meshStandardMaterial color="#4A5560" metalness={0.65} roughness={0.32} />
      </mesh>
      <mesh position={[0.32, 1.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.28, 10]} />
        <meshStandardMaterial color={mat.handrail} metalness={0.4} roughness={0.4} />
      </mesh>

      {([-1, 1] as const).map((s) => (
        <group key={s} position={[0.38 * s, 1.28, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.22, 0.24]} />
            <meshStandardMaterial color="#5C636B" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0.2 * s, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.22, 10]} />
            <meshStandardMaterial color={pipeMat.oil} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0.32 * s, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
            <meshStandardMaterial {...steelProps('light')} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 1.52, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.28]} />
        <meshStandardMaterial color="#4A5560" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.78, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.28, 12]} />
        <meshStandardMaterial {...steelProps('light')} />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial
          color={status >= 95 ? '#2E8B57' : status >= 85 ? '#D4A017' : '#C0392B'}
          metalness={0.45}
          roughness={0.4}
        />
      </mesh>

      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 1.35, 0.22]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
          <meshStandardMaterial color="#E8EBEE" metalness={0.2} roughness={0.3} />
        </mesh>
      ))}

      <HorizontalPipe length={1.4} radius={0.05} color={pipeMat.oil} position={[0.95, 1.28, 0]} />
      <mesh position={[1.6, 0.55, 0]} castShadow>
        <boxGeometry args={[0.35, 0.9, 0.35]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
      <HorizontalPipe
        length={0.9}
        radius={0.045}
        color={pipeMat.gas}
        position={[1.6, 0.85, 0.4]}
        rotationY={Math.PI / 2}
      />

      <mesh position={[2.2, 0.2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.16, 0.7]} />
        <meshStandardMaterial color={mat.concrete} roughness={0.9} />
      </mesh>
      <mesh position={[2.2, 0.55, 0]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.4]} />
        <meshStandardMaterial color="#5C636B" metalness={0.55} roughness={0.4} />
      </mesh>

      <Handrail length={1.6} position={[0, 0.15, -0.85]} />
      <Handrail length={1.6} position={[0, 0.15, 0.85]} />

      {label && (
        <mesh position={[0, 0.55, -0.95]} castShadow>
          <boxGeometry args={[0.7, 0.28, 0.03]} />
          <meshStandardMaterial color="#F5F5F0" roughness={0.7} />
        </mesh>
      )}

      {withPumpjack && <PumpJack position={[-1.8, 0, 0]} />}

      <mesh position={[1.1, 1.1, 1.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 2.2, 6]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
    </group>
  )
}

function PumpJack({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.8, 0.2, 0.7]} />
        <meshStandardMaterial color={mat.concreteDark} roughness={0.9} />
      </mesh>
      <mesh position={[0.35, 1.2, 0]} castShadow>
        <boxGeometry args={[0.18, 2.2, 0.18]} />
        <meshStandardMaterial color="#C0392B" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0.1, 2.35, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[2.4, 0.14, 0.16]} />
        <meshStandardMaterial color="#C0392B" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[-1.0, 2.05, 0]} castShadow>
        <boxGeometry args={[0.35, 0.55, 0.18]} />
        <meshStandardMaterial color="#A93226" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[1.15, 1.7, 0]} castShadow>
        <boxGeometry args={[0.45, 0.7, 0.35]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
      <mesh position={[-1.05, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
        <meshStandardMaterial {...steelProps('light')} />
      </mesh>
      <mesh position={[0.7, 0.55, 0.35]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.4]} />
        <meshStandardMaterial color="#4A5560" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}

export function WellClusterPad({
  count = 4,
  withPumpjack = true,
}: {
  count?: number
  withPumpjack?: boolean
}) {
  const wells = Array.from({ length: count }, (_, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    return {
      id: i,
      pos: [col * 3.2 - 1.6, 0, row * 3.4 - 1.5] as [number, number, number],
      label: `Скв. ${1201 + i}`,
      pump: withPumpjack && i === 0,
    }
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[8.5, 8]} />
        <meshStandardMaterial color="#9A9590" roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.15, -3.9]} castShadow>
        <boxGeometry args={[8.5, 0.3, 0.4]} />
        <meshStandardMaterial color={mat.earth} roughness={0.95} />
      </mesh>

      {wells.map((w) => (
        <DetailedWellhead
          key={w.id}
          position={w.pos}
          label={w.label}
          status={88 + (w.id % 4) * 3}
          withPumpjack={w.pump}
        />
      ))}

      <mesh position={[0, 0.35, 3.2]} castShadow>
        <boxGeometry args={[5.5, 0.5, 0.55]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>
      <HorizontalPipe length={5.2} color={pipeMat.oil} radius={0.08} position={[0, 0.7, 3.2]} />
      <HorizontalPipe length={5.2} color={pipeMat.gas} radius={0.055} position={[0, 0.55, 3.45]} />
      <HorizontalPipe length={5.2} color={pipeMat.water} radius={0.05} position={[0, 0.55, 2.95]} />

      <mesh position={[3.6, 0.7, 3.2]} castShadow>
        <boxGeometry args={[1.4, 1.2, 1.2]} />
        <meshStandardMaterial color={mat.building} roughness={0.8} />
      </mesh>
      <mesh position={[3.6, 1.35, 3.2]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1.3]} />
        <meshStandardMaterial color={mat.buildingRoof} />
      </mesh>
    </group>
  )
}

/** Underground trajectories — WellTracking-style */
export function WellboresUnderground({
  origins,
  visible,
}: {
  origins: Array<[number, number, number]>
  visible: boolean
}) {
  const tubes = useMemo(() => {
    return origins.map((o, i) => {
      const pts: THREE.Vector3[] = []
      for (let t = 0; t <= 16; t++) {
        const k = t / 16
        pts.push(
          new THREE.Vector3(
            o[0] + Math.sin(i * 1.3 + k * 2.2) * k * 1.6,
            o[1] - k * 5.2,
            o[2] + Math.cos(i * 0.9 + k * 1.4) * k * 1.1,
          ),
        )
      }
      const curve = new THREE.CatmullRomCurve3(pts)
      return new THREE.TubeGeometry(curve, 64, 0.045, 6, false)
    })
  }, [origins])

  if (!visible) return null

  return (
    <group>
      {tubes.map((geom, i) => (
        <mesh key={i} geometry={geom}>
          <meshStandardMaterial
            color="#32ADE5"
            transparent
            opacity={0.65}
            metalness={0.25}
            roughness={0.35}
            emissive="#0a3a55"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      {/* reservoir slice */}
      <mesh position={[origins[0]?.[0] ?? 0, -4.8, origins[0]?.[2] ?? 0]} rotation={[-0.15, 0.2, 0]}>
        <boxGeometry args={[14, 0.7, 10]} />
        <meshStandardMaterial color="#4A6B5C" transparent opacity={0.45} roughness={0.9} />
      </mesh>
      <mesh position={[origins[0]?.[0] ?? 0, -5.4, origins[0]?.[2] ?? 0]} rotation={[-0.15, 0.2, 0]}>
        <boxGeometry args={[14, 0.5, 10]} />
        <meshStandardMaterial color="#2F4A3E" transparent opacity={0.5} roughness={0.9} />
      </mesh>
    </group>
  )
}
