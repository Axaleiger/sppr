import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { FIELD_ORIGIN, sampleHeight, stitchEsriTiles } from './gis'
import { mat } from './materials'

/** Instanced grass — detailed look, GPU-friendly */
function GrassField({ count = 1400 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geom = useMemo(() => {
    const g = new THREE.ConeGeometry(0.04, 0.32, 3)
    g.translate(0, 0.16, 0)
    return g
  }, [])
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      c.setHSL(0.28 + Math.random() * 0.08, 0.45 + Math.random() * 0.25, 0.28 + Math.random() * 0.18)
      arr[i * 3] = c.r
      arr[i * 3 + 1] = c.g
      arr[i * 3 + 2] = c.b
    }
    return arr
  }, [count])

  useEffect(() => {
    if (!mesh.current) return
    mesh.current.instanceColor = new THREE.InstancedBufferAttribute(colors, 3)
    let i = 0
    let tries = 0
    while (i < count && tries < count * 10) {
      tries++
      const x = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 80
      if (Math.hypot(x, z) < 24) continue
      const y = sampleHeight(x, z)
      dummy.position.set(x, y, z)
      dummy.rotation.set((Math.random() - 0.5) * 0.2, Math.random() * Math.PI, (Math.random() - 0.5) * 0.2)
      const s = 0.75 + Math.random() * 1.15
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      i++
    }
    mesh.current.count = i
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count, colors, dummy])

  return (
    <instancedMesh ref={mesh} args={[geom, undefined, count]} castShadow={false} receiveShadow frustumCulled>
      <meshStandardMaterial vertexColors roughness={0.9} metalness={0} />
    </instancedMesh>
  )
}

function TerrainMesh({ mapMode }: { mapMode: 'imagery' | 'topo' | 'none' }) {
  const [mapTex, setMapTex] = useState<THREE.CanvasTexture | null>(null)
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(120, 95, 64, 52)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const r = Math.hypot(x, z)
      const flatten = Math.min(1, Math.max(0, (r - 20) / 12))
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
    stitchEsriTiles(FIELD_ORIGIN.lat, FIELD_ORIGIN.lon, FIELD_ORIGIN.zoom, 1, mapMode).then((canvas) => {
      if (!alive) return
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 4
      tex.needsUpdate = true
      setMapTex(tex)
    })
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[58, 50]} />
        <meshStandardMaterial color={mat.gravel} roughness={0.98} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 2]} receiveShadow>
        <planeGeometry args={[75, 3.2]} />
        <meshStandardMaterial color={mat.asphalt} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.035, 0]} receiveShadow>
        <planeGeometry args={[3.2, 58]} />
        <meshStandardMaterial color={mat.asphalt} roughness={0.92} />
      </mesh>
      {showGrass && <GrassField count={1400} />}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        const r = 42 + (i % 4) * 2
        const x = Math.cos(a) * r
        const z = Math.sin(a) * r * 0.72
        return (
          <group key={i} position={[x, sampleHeight(x, z), z]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.1, 0.7, 5]} />
              <meshStandardMaterial color="#5C4033" />
            </mesh>
            <mesh position={[0, 1.05, 0]} castShadow>
              <coneGeometry args={[0.5, 1.2, 6]} />
              <meshStandardMaterial color="#3D6B35" roughness={0.9} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
