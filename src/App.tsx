import { Navigate, Route, Routes } from 'react-router-dom'
import Module1Page from './pages/Module1Page'
import Module11NewPage from './pages/Module11NewPage'
import Module12NewPage from './pages/Module12NewPage'
import Module15NewPage from './pages/Module15NewPage'
import Module1Sub2Page from './pages/Module1Sub2Page'
import Module1Sub3Page from './pages/Module1Sub3Page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/module/1/2" replace />} />
      <Route path="/module/1" element={<Navigate to="/module/1/2" replace />} />
    <Route path="/module/1/1" element={<Module11NewPage />} />
    <Route path="/module/1/1/legacy" element={<Module1Page />} />
  <Route path="/module/1/2" element={<Module12NewPage />} />
  <Route path="/module/1/2/legacy" element={<Module1Sub2Page />} />
    <Route path="/module/1/3" element={<Module1Sub3Page />} />
  <Route path="/module/1/5" element={<Module15NewPage />} />
      <Route path="/norms" element={<Navigate to="/module/1/2" replace />} />
      <Route path="*" element={<Navigate to="/module/1/2" replace />} />
    </Routes>
  )
}

export default App