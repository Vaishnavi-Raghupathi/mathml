import { Route, Routes } from 'react-router-dom'
import DesktopGate from './components/ui/DesktopGate'
import Home from './pages/Home'
import Module1Page from './pages/Module1Page'
import Module2Page from './pages/Module2Page'
import Module3Page from './pages/Module3Page'

function App() {
  return (
    <DesktopGate>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/1" element={<Module1Page />} />
        <Route path="/module/2" element={<Module2Page />} />
        <Route path="/module/3" element={<Module3Page />} />
      </Routes>
    </DesktopGate>
  )
}

export default App