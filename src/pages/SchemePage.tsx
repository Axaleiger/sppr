import { useState } from 'react'
import { SchemeCanvas, SchemeToolbar } from '../components/topology/SchemeCanvas'
import { Topology3D } from '../components/topology/Topology3D'

export type SchemeMode = '3d' | 'iso' | 'tech'

export function SchemePage() {
  const [mode, setMode] = useState<SchemeMode>('3d')
  const [whatIf, setWhatIf] = useState(false)

  return (
    <div className="pb-4">
      <SchemeToolbar mode={mode} setMode={setMode} whatIf={whatIf} setWhatIf={setWhatIf} />
      <div className="px-0 md:px-6">
        {mode === '3d' ? (
          <Topology3D whatIf={whatIf} />
        ) : (
          <SchemeCanvas mode={mode} whatIf={whatIf} />
        )}
      </div>
    </div>
  )
}
