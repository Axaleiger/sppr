import { mat, pipeMat, steelProps } from './materials'
import { Foundation, Handrail, HorizontalPipe } from './Primitives'

/** Detailed Christmas tree — restored visual quality */
export function DetailedWellhead({
  position = [0, 0, 0] as [number, number, number],
  status = 95,
  withPumpjack = false,
}: {
  position?: [number, number, number]
  status?: number
  withPumpjack?: boolean
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.7, 0.75, 0.1, 16]} />
        <meshStandardMaterial color={mat.concreteDark} roughness={0.92} />
      </mesh>
      <Foundation w={1.4} d={1.4} h={0.1} />

      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.34, 0.28, 14]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.22, 12]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.3, 12]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>

      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.26, 0.34]} />
        <meshStandardMaterial color="#4A5560" metalness={0.65} roughness={0.32} />
      </mesh>
      <mesh position={[0.3, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.24, 8]} />
        <meshStandardMaterial color={mat.handrail} metalness={0.4} roughness={0.4} />
      </mesh>

      {([-1, 1] as const).map((s) => (
        <group key={s} position={[0.36 * s, 1.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.2, 0.22]} />
            <meshStandardMaterial color="#5C636B" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0.18 * s, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
            <meshStandardMaterial color={pipeMat.oil} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 1.58, 0]} castShadow>
        <boxGeometry args={[0.28, 0.18, 0.26]} />
        <meshStandardMaterial color="#4A5560" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.82, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.26, 10]} />
        <meshStandardMaterial {...steelProps('light')} />
      </mesh>
      <mesh position={[0, 2.02, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color={status >= 95 ? '#2E8B57' : status >= 85 ? '#D4A017' : '#C0392B'}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      <HorizontalPipe length={1.2} radius={0.045} color={pipeMat.oil} position={[0.85, 1.35, 0]} />
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
      <mesh position={[2.0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.7, 0.14, 0.55]} />
        <meshStandardMaterial color={mat.concrete} roughness={0.9} />
      </mesh>
      <mesh position={[2.0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.35]} />
        <meshStandardMaterial color="#5C636B" metalness={0.55} roughness={0.4} />
      </mesh>

      <Handrail length={1.4} position={[0, 0.12, -0.75]} />

      {withPumpjack && (
        <group position={[-1.7, 0, 0]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[1.6, 0.18, 0.6]} />
            <meshStandardMaterial color={mat.concreteDark} roughness={0.9} />
          </mesh>
          <mesh position={[0.3, 1.1, 0]} castShadow>
            <boxGeometry args={[0.16, 2.0, 0.16]} />
            <meshStandardMaterial color="#C0392B" metalness={0.4} roughness={0.45} />
          </mesh>
          <mesh position={[0.05, 2.15, 0]} rotation={[0, 0, -0.22]} castShadow>
            <boxGeometry args={[2.1, 0.12, 0.14]} />
            <meshStandardMaterial color="#C0392B" metalness={0.4} roughness={0.45} />
          </mesh>
          <mesh position={[-0.9, 1.9, 0]} castShadow>
            <boxGeometry args={[0.3, 0.48, 0.16]} />
            <meshStandardMaterial color="#A93226" metalness={0.4} roughness={0.45} />
          </mesh>
          <mesh position={[1.0, 1.55, 0]} castShadow>
            <boxGeometry args={[0.4, 0.6, 0.3]} />
            <meshStandardMaterial {...steelProps('dark')} />
          </mesh>
          <mesh position={[-0.95, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, 1.6, 6]} />
            <meshStandardMaterial {...steelProps('light')} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export function WellClusterPad({ count = 3 }: { count?: number }) {
  const wells = Array.from({ length: count }, (_, i) => ({
    id: i,
    pos: [(i % 2) * 2.8 - 1.4, 0, Math.floor(i / 2) * 2.8 - 0.9] as [number, number, number],
    pump: i === 0,
  }))

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[7, 6.5]} />
        <meshStandardMaterial color="#9A9590" roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.14, -3.1]} castShadow>
        <boxGeometry args={[7, 0.28, 0.35]} />
        <meshStandardMaterial color={mat.earth} roughness={0.95} />
      </mesh>
      {wells.map((w) => (
        <DetailedWellhead key={w.id} position={w.pos} status={88 + w.id * 3} withPumpjack={w.pump} />
      ))}
      <mesh position={[0, 0.35, 2.6]} castShadow>
        <boxGeometry args={[5, 0.45, 0.5]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>
      <HorizontalPipe length={4.6} color={pipeMat.oil} radius={0.07} position={[0, 0.65, 2.6]} />
      <HorizontalPipe length={4.6} color={pipeMat.gas} radius={0.05} position={[0, 0.5, 2.85]} />
      <mesh position={[3.2, 0.65, 2.6]} castShadow>
        <boxGeometry args={[1.3, 1.1, 1.15]} />
        <meshStandardMaterial color={mat.building} roughness={0.8} />
      </mesh>
      <mesh position={[3.2, 1.25, 2.6]} castShadow>
        <boxGeometry args={[1.4, 0.1, 1.25]} />
        <meshStandardMaterial color={mat.buildingRoof} />
      </mesh>
    </group>
  )
}

export { WellboresUnderground } from './Wellbores'
