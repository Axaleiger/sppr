import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { AssistantLevel1 } from './pages/AssistantLevel1'
import { AssistantLevel2 } from './pages/AssistantLevel2'
import { AssistantLevel3 } from './pages/AssistantLevel3'
import { EventsPage } from './pages/EventsPage'
import { SchemePage } from './pages/SchemePage'
import { OrchestratorPage } from './pages/OrchestratorPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/assistant" replace />} />
          <Route path="assistant" element={<AssistantLevel1 />} />
          <Route path="assistant/production" element={<AssistantLevel2 />} />
          <Route path="assistant/video" element={<AssistantLevel3 />} />
          <Route path="assistant/video/events" element={<EventsPage />} />
          <Route path="scheme" element={<SchemePage />} />
          <Route path="orchestrator" element={<OrchestratorPage />} />
          <Route path="*" element={<Navigate to="/assistant" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
