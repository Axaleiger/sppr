/** Web Mercator helpers + ESRI World Imagery (no API key) */

export function latLonToTile(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom
  const x = Math.floor(((lon + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  )
  return { x, y, z: zoom }
}

/** Orenburg field area — demo georeference */
export const FIELD_ORIGIN = { lat: 51.772, lon: 55.098, zoom: 14 }

export function esriImageryUrl(z: number, x: number, y: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`
}

export function esriTopoUrl(z: number, x: number, y: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`
}

export async function loadTileImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

/** Stitch NxN satellite tiles into one canvas texture source */
export async function stitchEsriTiles(
  centerLat: number,
  centerLon: number,
  zoom: number,
  radius = 2,
  mode: 'imagery' | 'topo' = 'imagery',
): Promise<HTMLCanvasElement> {
  const { x: cx, y: cy } = latLonToTile(centerLat, centerLon, zoom)
  const size = radius * 2 + 1
  const tile = 256
  const canvas = document.createElement('canvas')
  canvas.width = size * tile
  canvas.height = size * tile
  const ctx = canvas.getContext('2d')!

  // fallback base
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  g.addColorStop(0, '#5a7a45')
  g.addColorStop(0.4, '#6e8f52')
  g.addColorStop(0.7, '#8a8570')
  g.addColorStop(1, '#6a7d55')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const jobs: Promise<void>[] = []
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const tx = cx + dx
      const ty = cy + dy
      const url =
        mode === 'imagery' ? esriImageryUrl(zoom, tx, ty) : esriTopoUrl(zoom, tx, ty)
      jobs.push(
        loadTileImage(url).then((img) => {
          if (!img) return
          const px = (dx + radius) * tile
          const py = (dy + radius) * tile
          ctx.drawImage(img, px, py, tile, tile)
        }),
      )
    }
  }
  await Promise.all(jobs)

  // subtle GIS overlays: contour-like noise
  ctx.globalAlpha = 0.08
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = '#2a3a20'
    ctx.beginPath()
    const y = (i / 40) * canvas.height + Math.sin(i) * 8
    ctx.moveTo(0, y)
    for (let x = 0; x < canvas.width; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 6)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  return canvas
}

/** Procedural height field for gentle terrain undulation */
export function sampleHeight(x: number, z: number) {
  return (
    Math.sin(x * 0.045) * Math.cos(z * 0.038) * 0.55 +
    Math.sin(x * 0.12 + z * 0.08) * 0.18 +
    Math.cos(z * 0.09) * 0.12
  )
}
