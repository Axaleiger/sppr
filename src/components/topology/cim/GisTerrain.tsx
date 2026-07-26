import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FIELD_ORIGIN, sampleHeight, stitchEsriTiles } from './gis'
import { mat } from './materials'

function GrassField({
  count = 3200,
  spread = 48,
  excludeR = 18,
}: {
  count?: number
  spread?: number
  excludeR?: number
}) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geom = useMemo(() => {
    const g = new THREE.ConeGeometry(0.035, 0.28, 3)
    g.translate(0, 0.14, 0)
    return g
  }, [])

  useEffect(() => {
    if (!mesh.current) return
    let i = 0
    let attempts = 0
    while (i < count && attempts < count * 8) {
      attempts++
      const x = (Math.random() - 0.5) * spread * 2
      const z = (Math.random() - 0.5) * spread * 1.6
      if (Math.hypot(x, z) < excludeR) continue
      const y = sampleHeight(x, z)
      dummy.position.set(x, y, z)
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.25,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.25,
      )
      const s = 0.7 + Math.random() * 1.1
      dummy.scale.set(s, s * (0.8 + Math.random() * 0.8), s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      i++
    }
    mesh.current.count = i
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count, spread, excludeR, dummy])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.002
  })

  return (
    <instancedMesh ref={mesh} args={[geom, undefined, count]} castShadow={false} receiveShadow>
      <meshStandardMaterial
        color="#4F7A3E"
        roughness={0.92}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

function TerrainMesh({
  mapMode,
}: {
  mapMode: 'imagery' | 'topo' | 'none'
}) {
  const [mapTex, setMapTex] = useState<THREE.CanvasTexture | null>(null)
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(110, 90, 128, 104)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      // flatten industrial core
      const r = Math.hypot(x, z)
      const flatten = Math.min(1, Math.max(0, (r - 14) / 10))
      pos.setY(i, sampleHeight(x, z) * flatten)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  useEffect(() => {
    let alive = true
    if (mapMode === 'none') {
      setMapTex(null)
      return
    }
    stitchEsriTiles(FIELD_ORIGIN.lat, FIELD_ORIGIN.lon, FIELD_ORIGIN.zoom, 2, mapMode).then(
      (canvas) => {
        if (!alive) return
        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.needsUpdate = true
        setMapTex(tex)
      },
    )
    return () => {
      alive = false
    }
  }, [mapMode])

  return (
    <mesh geometry={geo} receiveShadow position={[0, -0.04, 0]}>
      <meshStandardMaterial
        map={mapTex ?? undefined}
        color={mapTex ? '#ffffff' : '#6B8F4E'}
        roughness={0.95}
        metalness={0.02}
      />
    </mesh>
  )
}

function AccessRoads() {
  const paths: Array<{ from: [number, number]; to: [number, number]; w: number }> = [
    { from: [-40, 2], to: [40, 2], w: 3.4 },
    { from: [-2, -30], to: [-2, 30], w: 3.2 },
    { from: [-16, -8], to: [-2, 2], w: 2.4 },
    { from: [-16, 4], to: [-2, 2], w: 2.4 },
    { from: [-2, -2], to: [10, -10], w: 2.6 },
    { from: [10, -2], to: [14, 6], w: 2.4 },
  ]

  return (
    <group>
      {paths.map((p, i) => {
        const dx = p.to[0] - p.from[0]
        const dz = p.to[1] - p.from[1]
        const len = Math.hypot(dx, dz)
        const mid: [number, number, number] = [
          (p.from[0] + p.to[0]) / 2,
          0.03,
          (p.from[1] + p.to[1]) / 2,
        ]
        const yaw = Math.atan2(dx, dz)
        return (
          <mesh key={i} position={mid} rotation={[-Math.PI / 2, 0, -yaw]} receiveShadow>
            <planeGeometry args={[p.w, len]} />
            <meshStandardMaterial color={mat.asphalt} roughness={0.92} metalness={0.05} />
          </mesh>
        )
      })}
    </group>
  )
}

function IndustrialPad() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[42, 34]} />
        <meshStandardMaterial color={mat.gravel} roughness={0.98} metalness={0.04} />
      </mesh>
      {/* curb */}
      <mesh position={[0, 0.06, -17]} castShadow>
        <boxGeometry args={[42, 0.12, 0.25]} />
        <meshStandardMaterial color={mat.concreteDark} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.06, 17]} castShadow>
        <boxGeometry args={[42, 0.12, 0.25]} />
        <meshStandardMaterial color={mat.concreteDark} roughness={0.9} />
      </mesh>
    </group>
  )
}

export function GisTerrain({
  mapMode,
  showGrass,
}: {
  mapMode: 'imagery' | 'topo' | 'none'
  showGrass: boolean
}) {
  return (
    <group>
      <TerrainMesh mapMode={mapMode} />
      <IndustrialPad />
      <AccessRoads />
      {showGrass && <GrassField />}
      {/* distant tree clusters as simple cones */}
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2
        const r = 38 + (i % 5) * 2.5
        const x = Math.cos(a) * r
        const z = Math.sin(a) * r * 0.75
        const y = sampleHeight(x, z)
        return (
          <group key={i} position={[x, y, z]}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
              <meshStandardMaterial color="#5C4033" />
            </mesh>
            <mesh position={[0, 1.2, 0]} castShadow>
              <coneGeometry args={[0.55, 1.4, 7]} />
              <meshStandardMaterial color="#3D6B35" roughness={0.9} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
