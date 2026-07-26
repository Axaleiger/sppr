import { mat, steelProps, concreteProps } from './materials'

/** Shared low-level industrial geometry — CAD / LOD300 feel */

export function Foundation({
  w = 2.4,
  d = 2.4,
  h = 0.18,
}: {
  w?: number
  d?: number
  h?: number
}) {
  return (
    <mesh position={[0, h / 2, 0]} receiveShadow castShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial {...concreteProps()} color={mat.foundation} />
    </mesh>
  )
}

export function IBeam({
  length,
  height = 0.18,
  width = 0.1,
  rotation = [0, 0, 0] as [number, number, number],
  position = [0, 0, 0] as [number, number, number],
}: {
  length: number
  height?: number
  width?: number
  rotation?: [number, number, number]
  position?: [number, number, number]
}) {
  const s = steelProps('dark')
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[length, height * 0.12, width]} />
        <meshStandardMaterial {...s} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[length, height, width * 0.22]} />
        <meshStandardMaterial {...s} />
      </mesh>
      <mesh position={[0, -height / 2, 0]} castShadow>
        <boxGeometry args={[length, height * 0.12, width]} />
        <meshStandardMaterial {...s} />
      </mesh>
    </group>
  )
}

export function Column({
  height = 2.2,
  size = 0.12,
  position = [0, 0, 0] as [number, number, number],
}) {
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]} castShadow>
      <boxGeometry args={[size, height, size]} />
      <meshStandardMaterial {...steelProps('dark')} />
    </mesh>
  )
}

export function PipeSegment({
  start,
  end,
  radius = 0.06,
  color,
}: {
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
  color: string
}) {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dz = end[2] - start[2]
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ]
  const yaw = Math.atan2(dx, dz)
  const pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz))

  return (
    <mesh position={mid} rotation={[Math.PI / 2 - pitch, yaw, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, len, 12]} />
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
    </mesh>
  )
}

export function HorizontalPipe({
  length,
  radius = 0.055,
  color,
  position,
  rotationY = 0,
}: {
  length: number
  radius?: number
  color: string
  position: [number, number, number]
  rotationY?: number
}) {
  return (
    <mesh position={position} rotation={[0, rotationY, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[radius, radius, length, 14]} />
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
    </mesh>
  )
}

export function PipeRackBay({
  length = 4,
  height = 1.6,
  width = 1.2,
  pipes = ['#6B4423', '#D4A017', '#2E8B57'] as string[],
  position = [0, 0, 0] as [number, number, number],
  rotationY = 0,
}) {
  const cols = [-width / 2, width / 2]
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {cols.map((x) => (
        <group key={x}>
          <Column height={height} position={[x, 0, -length / 2]} />
          <Column height={height} position={[x, 0, length / 2]} />
        </group>
      ))}
      {/* longitudinal beams */}
      {cols.map((x) => (
        <IBeam
          key={`lb-${x}`}
          length={length}
          position={[x, height, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}
      {/* cross beams */}
      {[-length / 2, 0, length / 2].map((z) => (
        <IBeam key={`cb-${z}`} length={width} position={[0, height, z]} />
      ))}
      {/* pipes on rack */}
      {pipes.map((c, i) => {
        const x = -width / 2 + 0.2 + i * ((width - 0.4) / Math.max(pipes.length - 1, 1))
        return (
          <HorizontalPipe
            key={i}
            length={length + 0.4}
            radius={0.045 + (i % 3) * 0.012}
            color={c}
            position={[x, height + 0.12, 0]}
            rotationY={Math.PI / 2}
          />
        )
      })}
      {/* cable tray */}
      <mesh position={[0, height + 0.28, 0]} castShadow>
        <boxGeometry args={[width * 0.35, 0.04, length]} />
        <meshStandardMaterial {...steelProps('light')} color="#A0A7B0" />
      </mesh>
    </group>
  )
}

export function Handrail({
  length,
  position,
  rotationY = 0,
}: {
  length: number
  position: [number, number, number]
  rotationY?: number
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[length, 0.03, 0.03]} />
        <meshStandardMaterial color={mat.handrail} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[length, 0.025, 0.025]} />
        <meshStandardMaterial color={mat.handrail} metalness={0.4} roughness={0.4} />
      </mesh>
      {Array.from({ length: Math.floor(length / 0.35) + 1 }, (_, i) => {
        const x = -length / 2 + i * 0.35
        return (
          <mesh key={i} position={[x, 0.28, 0]}>
            <boxGeometry args={[0.025, 0.55, 0.025]} />
            <meshStandardMaterial color={mat.handrail} metalness={0.4} roughness={0.4} />
          </mesh>
        )
      })}
    </group>
  )
}

export function StairTower({
  height = 2.4,
  position = [0, 0, 0] as [number, number, number],
}) {
  const steps = Math.floor(height / 0.22)
  return (
    <group position={position}>
      <Column height={height} size={0.08} position={[-0.35, 0, -0.2]} />
      <Column height={height} size={0.08} position={[0.35, 0, -0.2]} />
      <Column height={height} size={0.08} position={[-0.35, 0, 0.2]} />
      <Column height={height} size={0.08} position={[0.35, 0, 0.2]} />
      {Array.from({ length: steps }, (_, i) => (
        <mesh key={i} position={[0, 0.12 + i * 0.22, 0]} castShadow>
          <boxGeometry args={[0.7, 0.04, 0.35]} />
          <meshStandardMaterial {...steelProps('mid')} />
        </mesh>
      ))}
      <Handrail length={0.7} position={[0, height - 0.5, -0.22]} />
    </group>
  )
}

export function VerticalVessel({
  radius = 0.45,
  height = 2.2,
  color = mat.steelLight as string,
  position = [0, 0, 0] as [number, number, number],
  legs = true,
}: {
  radius?: number
  height?: number
  color?: string
  position?: [number, number, number]
  legs?: boolean
}) {
  return (
    <group position={position}>
      {legs &&
        [-0.35, 0.35].flatMap((x) =>
          [-0.35, 0.35].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.35, z]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
              <meshStandardMaterial {...steelProps('dark')} />
            </mesh>
          )),
        )}
      <mesh position={[0, legs ? 0.7 + height / 2 : height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height, 28]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh
        position={[0, legs ? 0.7 + height : height, 0]}
        castShadow
      >
        <sphereGeometry args={[radius, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh position={[0, legs ? 0.7 + height + 0.25 : height + 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.35, 10]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
    </group>
  )
}

export function HorizontalVessel({
  radius = 0.35,
  length = 2.2,
  position = [0, 0, 0] as [number, number, number],
  color = mat.steelLight as string,
}: {
  radius?: number
  length?: number
  position?: [number, number, number]
  color?: string
}) {
  return (
    <group position={position}>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]} castShadow>
          <boxGeometry args={[0.12, 0.7, 0.5]} />
          <meshStandardMaterial {...steelProps('dark')} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, length, 28]} />
        <meshStandardMaterial color={color} metalness={0.65} roughness={0.28} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[(length / 2) * s, 0.75, 0]}
          rotation={[0, 0, (Math.PI / 2) * s]}
          castShadow
        >
          <sphereGeometry args={[radius, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} metalness={0.65} roughness={0.28} />
        </mesh>
      ))}
    </group>
  )
}

export function BlockBuilding({
  w = 2.2,
  h = 1.4,
  d = 1.6,
  position = [0, 0, 0] as [number, number, number],
  roof = true,
}) {
  return (
    <group position={position}>
      <Foundation w={w + 0.3} d={d + 0.3} h={0.12} />
      <mesh position={[0, 0.12 + h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={mat.building} metalness={0.08} roughness={0.78} />
      </mesh>
      {/* windows */}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.12 + h * 0.55, d / 2 + 0.01]}>
          <boxGeometry args={[0.45, 0.35, 0.02]} />
          <meshStandardMaterial color={mat.window} metalness={0.3} roughness={0.15} transparent opacity={0.75} />
        </mesh>
      ))}
      <mesh position={[0, 0.12 + h * 0.35, d / 2 + 0.01]}>
        <boxGeometry args={[0.35, 0.7, 0.02]} />
        <meshStandardMaterial color={mat.steelDark} metalness={0.4} roughness={0.5} />
      </mesh>
      {roof && (
        <mesh position={[0, 0.12 + h + 0.06, 0]} castShadow>
          <boxGeometry args={[w + 0.15, 0.12, d + 0.15]} />
          <meshStandardMaterial color={mat.buildingRoof} metalness={0.35} roughness={0.5} />
        </mesh>
      )}
    </group>
  )
}

export function StorageTank({
  radius = 1.1,
  height = 1.6,
  position = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position}>
      <Foundation w={radius * 2.3} d={radius * 2.3} h={0.15} />
      <mesh position={[0, 0.15 + height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height, 48]} />
        <meshStandardMaterial color={mat.steelLight} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.15 + height, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.98, radius, 0.08, 48]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
      {/* wind girders */}
      {[0.4, 0.8, 1.2].map((y) => (
        <mesh key={y} position={[0, 0.15 + y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius + 0.02, 0.025, 8, 48]} />
          <meshStandardMaterial {...steelProps('dark')} />
        </mesh>
      ))}
      <StairTower height={height + 0.3} position={[radius + 0.35, 0.15, 0]} />
      <Handrail
        length={Math.PI * radius * 0.55}
        position={[0, 0.15 + height + 0.15, 0]}
        rotationY={0.4}
      />
    </group>
  )
}

export function PumpSkid({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[1.2, 0.16, 0.7]} />
        <meshStandardMaterial {...concreteProps()} />
      </mesh>
      <mesh position={[-0.25, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.45, 16]} />
        <meshStandardMaterial {...steelProps('mid')} color="#7A8490" />
      </mesh>
      <mesh position={[0.25, 0.38, 0]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.4]} />
        <meshStandardMaterial color="#4A5560" metalness={0.5} roughness={0.4} />
      </mesh>
      <HorizontalPipe length={0.9} color="#6B4423" position={[0, 0.55, 0.28]} />
    </group>
  )
}

export function TransformerYard({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <Foundation w={2.2} d={1.6} />
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.4, 1.0, 0.9]} />
        <meshStandardMaterial color="#6B7280" metalness={0.55} roughness={0.4} />
      </mesh>
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 1.35, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.35, 10]} />
          <meshStandardMaterial color="#C4A35A" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      {/* gantry */}
      <Column height={2.8} position={[-1.1, 0, 0]} />
      <Column height={2.8} position={[1.1, 0, 0]} />
      <IBeam length={2.4} position={[0, 2.8, 0]} />
      <HorizontalPipe length={2.2} color="#4A90A4" radius={0.03} position={[0, 2.6, 0]} />
    </group>
  )
}

export function WellheadAssembly({
  position = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position}>
      <Foundation w={1.1} d={1.1} h={0.14} />
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.35, 16]} />
        <meshStandardMaterial {...steelProps('dark')} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.55, 12]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>
      {/* X-mas tree valves */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.45, 0.28, 0.35]} />
        <meshStandardMaterial color="#5C636B" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.35, 1.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 10]} />
        <meshStandardMaterial color="#6B4423" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 10]} />
        <meshStandardMaterial {...steelProps('light')} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#C0392B" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  )
}

export function FlareStack({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <Foundation w={1.2} d={1.2} />
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.22, 6.2, 14]} />
        <meshStandardMaterial {...steelProps('mid')} />
      </mesh>
      {[1.5, 3, 4.5].map((y) => (
        <group key={y}>
          {([0, 1, 2] as const).map((i) => {
            const a = (i / 3) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.55, y, Math.sin(a) * 0.55]}
                castShadow
              >
                <cylinderGeometry args={[0.025, 0.025, y * 0.35, 6]} />
                <meshStandardMaterial {...steelProps('dark')} />
              </mesh>
            )
          })}
        </group>
      ))}
      <mesh position={[0, 6.4, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.25, 12]} />
        <meshStandardMaterial color="#4A4F55" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}
