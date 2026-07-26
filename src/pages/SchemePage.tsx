import { useState } from 'react'
import { SchemeCanvas, SchemeToolbar } from '../components/topology/SchemeCanvas'

export function SchemePage() {
  const [mode, setMode] = useState<'iso' | 'tech'>('iso')
  const [whatIf, setWhatIf] = useState(false)

  return (
    <div className="pb-4">
      <SchemeToolbar mode={mode} setMode={setMode} whatIf={whatIf} setWhatIf={setWhatIf} />
      <div className="px-0 md:px-6">
        <SchemeCanvas mode={mode} whatIf={whatIf} />
      </div>
    </div>
  )
}
