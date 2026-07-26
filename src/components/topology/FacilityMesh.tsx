import { Html } from '@react-three/drei'
import { useState } from 'react'
import type { SchemeNodeData } from '../../data/topology'
import { FacilityAssembly } from './cim/FacilityAssembly'

interface Props {
  id: string
  position: [number, number, number]
  data: SchemeNodeData
  selected: boolean
  dimmed: boolean
  onSelect: (id: string) => void
}

/** Labels only when selected/hovered — Html on all nodes kills FPS */
export function FacilityMesh({
  id,
  position,
  data,
  selected,
  dimmed,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const showLabel = selected || hovered

  return (
    <group
      position={position}
      visible={!dimmed || selected}
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
      <FacilityAssembly kind={data.kind} />

      {(selected || hovered) && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.35, 32]} />
          <meshBasicMaterial color="#006CB1" transparent opacity={0.9} />
        </mesh>
      )}

      {showLabel && (
        <Html position={[0, 3.2, 0]} center distanceFactor={18} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              padding: '4px 8px',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid #006CB1',
              borderRadius: 2,
              fontFamily: 'Onest, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              color: '#1a2332',
              whiteSpace: 'nowrap',
            }}
          >
            {data.label} · {data.status}%
          </div>
        </Html>
      )}
    </group>
  )
}
