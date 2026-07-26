import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { FIELD_ORIGIN, sampleHeight, stitchEsriTiles } from './gis'
import { mat } from './materials'

function GrassPatches({ count = 180 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.45, 0.45)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  useEffect(() => {
    if (!mesh.current) return
    let i = 0
    let tries = 0
    while (i < count && tries < count * 6) {
      tries++
      const x = (Math.random() - 0.5) * 90
      const z = (Math.random() - 0.5) * 70
      if (Math.hypot(x, z) < 22) continue
      dummy.position.set(x, sampleHeight(x, z) + 0.02, z)
      dummy.rotation.y = Math.random() * Math.PI
      const s = 1.2 + Math.random() * 2
      dummy.scale.set(s, 1, s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      i++
    }
    mesh.current.count = i
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  return (
    <instancedMesh ref={mesh} args={[geom, undefined, count]} frustumCulled>
      <meshBasicMaterial color="#4A7340" transparent opacity={0.85} />
    </instancedMesh>
  )
}

function TerrainMesh({ mapMode }: { mapMode: 'imagery' | 'topo' | 'none' }) {
  const [mapTex, setMapTex] = useState<THREE.CanvasTexture | null>(null)
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(120, 95, 48, 40)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const r = Math.hypot(x, z)
      const flatten = Math.min(1, Math.max(0, (r - 18) / 12))
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
    // radius 1 = 3x3 tiles — enough and much faster
    stitchEsriTiles(FIELD_ORIGIN.lat, FIELD_ORIGIN.lon, FIELD_ORIGIN.zoom, 1, mapMode).then(
      (canvas) => {
        if (!alive) return
        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        tex.needsUpdate = true
        setMapTex(tex)
      },
    )
    return () => {
      alive = false
    }
  }, [mapMode])

  return (
    <mesh geometry={geo} position={[0, -0.04, 0]}>
      <meshBasicMaterial map={mapTex ?? undefined} color={mapTex ? '#ffffff' : '#6B8F4E'} />
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[55, 48]} />
        <meshBasicMaterial color={mat.gravel} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2]}>
        <planeGeometry args={[70, 3]} />
        <meshBasicMaterial color={mat.asphalt} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.03, 0]}>
        <planeGeometry args={[3, 55]} />
        <meshBasicMaterial color={mat.asphalt} />
      </mesh>
      {showGrass && <GrassPatches count={160} />}
    </group>
  )
}
