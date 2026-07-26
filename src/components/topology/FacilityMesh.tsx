import { useMemo, useState } from 'react'
import { Html, Line } from '@react-three/drei'
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

export function FacilityMesh({
  id,
  position,
  data,
  selected,
  dimmed,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const outline = useMemo(() => selected || hovered, [selected, hovered])

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

      {outline && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.6, 2.75, 64]} />
          <meshBasicMaterial color="#006CB1" transparent opacity={0.9} />
        </mesh>
      )}

      {selected && (
        <Line
          points={[
            [-2.8, 0.04, -2.4],
            [2.8, 0.04, -2.4],
            [2.8, 0.04, 2.4],
            [-2.8, 0.04, 2.4],
            [-2.8, 0.04, -2.4],
          ]}
          color="#006CB1"
          lineWidth={1.5}
        />
      )}

      <Html
        position={[0, 4.2, 0]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none', opacity: dimmed && !selected ? 0.15 : 1 }}
      >
        <div
          style={{
            minWidth: 128,
            padding: '5px 9px',
            background: 'rgba(255,255,255,0.94)',
            border: `1px solid ${selected ? '#006CB1' : '#B0B5BB'}`,
            borderRadius: 2,
            boxShadow: '0 1px 4px rgba(0,0,0,0.16)',
            fontFamily: 'Onest, sans-serif',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#1a2332',
              letterSpacing: '0.03em',
            }}
          >
            {data.label}
          </div>
          <div style={{ fontSize: 10, color: '#5C636B' }}>
            {data.status}% · ЦИМ LOD300
          </div>
        </div>
      </Html>

      <mesh position={[2.4, 0.3, 2.2]}>
        <boxGeometry args={[0.14, 0.14, 0.14]} />
        <meshStandardMaterial
          color={data.status >= 95 ? '#2E8B57' : data.status >= 85 ? '#D4A017' : '#C0392B'}
          metalness={0.35}
          roughness={0.45}
        />
      </mesh>
    </group>
  )
}
